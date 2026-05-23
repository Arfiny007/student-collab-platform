import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../post/post.entity";
import { User, UserRole } from "../user/user.entity";

const ADMIN_ROLES = [
  UserRole.ADMIN,
  UserRole.MODERATOR,
];

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  assertStaff(role: string) {
    if (!ADMIN_ROLES.includes(role as UserRole)) {
      throw new ForbiddenException(
        "Admin access required",
      );
    }
  }

  assertAdmin(role: string) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        "Admin role required",
      );
    }
  }

  async getStats(role: string) {
    this.assertStaff(role);

    const [
      users,
      posts,
      reportedPosts,
      hiddenPosts,
      blockedUsers,
      mutedUsers,
    ] = await Promise.all([
      this.userRepo.count(),
      this.postRepo.count(),
      this.postRepo
        .createQueryBuilder("post")
        .where("post.reports > 0")
        .getCount(),
      this.postRepo.count({
        where: { hidden: true },
      }),
      this.userRepo.count({
        where: { isBlocked: true },
      }),
      this.userRepo.count({
        where: { isMuted: true },
      }),
    ]);

    const roleBreakdown =
      await this.userRepo
        .createQueryBuilder("user")
        .select("user.role", "role")
        .addSelect("COUNT(*)", "count")
        .groupBy("user.role")
        .getRawMany();

    const postsByDay =
      await this.postRepo
        .createQueryBuilder("post")
        .select(
          "DATE(post.createdAt)",
          "day",
        )
        .addSelect("COUNT(*)", "count")
        .where(
          "post.createdAt >= NOW() - INTERVAL '7 days'",
        )
        .groupBy("DATE(post.createdAt)")
        .orderBy("day", "ASC")
        .getRawMany();

    return {
      users,
      posts,
      reportedPosts,
      hiddenPosts,
      blockedUsers,
      mutedUsers,
      roleBreakdown,
      postsByDay,
    };
  }

  async getModerationQueue(
    role: string,
    page = 1,
  ) {
    this.assertStaff(role);

    const limit = 10;
    const skip = (page - 1) * limit;

    const qb =
      this.postRepo
        .createQueryBuilder("post")
        .leftJoinAndSelect(
          "post.author",
          "author",
        )
        .where(
          "post.reports > 0 OR post.hidden = :hidden",
          { hidden: true },
        )
        .orderBy(
          "post.reports",
          "DESC",
        )
        .addOrderBy(
          "post.id",
          "DESC",
        );

    const total = await qb.getCount();

    const items = await qb
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      items: items.map((post) =>
        this.sanitizePost(post),
      ),
      total,
      page,
      hasMore:
        skip + limit < total,
    };
  }

  async listUsers(
    role: string,
    page = 1,
    q = "",
  ) {
    this.assertAdmin(role);

    const limit = 12;
    const skip = (page - 1) * limit;

    const qb =
      this.userRepo.createQueryBuilder(
        "user",
      );

    if (q.trim()) {
      qb.where(
        "LOWER(user.username) LIKE LOWER(:q) OR LOWER(user.email) LIKE LOWER(:q)",
        { q: `%${q.trim()}%` },
      );
    }

    const [items, total] =
      await qb
        .orderBy("user.id", "DESC")
        .skip(skip)
        .take(limit)
        .getManyAndCount();

    return {
      items: items.map((user) =>
        this.sanitizeUser(user),
      ),
      total,
      page,
      hasMore:
        skip + limit < total,
    };
  }

  async updateUser(
    role: string,
    id: number,
    body: {
      role?: UserRole;
      isBlocked?: boolean;
      isMuted?: boolean;
    },
  ) {
    this.assertAdmin(role);

    const user =
      await this.userRepo.findOne({
        where: { id },
      });

    if (!user) {
      throw new NotFoundException();
    }

    if (body.role !== undefined) {
      user.role = body.role;
    }

    if (body.isBlocked !== undefined) {
      user.isBlocked = body.isBlocked;
    }

    if (body.isMuted !== undefined) {
      user.isMuted = body.isMuted;
    }

    await this.userRepo.save(user);

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User) {
    const {
      password,
      ...safe
    } = user;

    return safe;
  }

  private sanitizePost(post: Post) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      reports: post.reports,
      hidden: post.hidden,
      likes: post.likes,
      views: post.views,
      createdAt: post.createdAt,
      author: post.author
        ? {
            id: post.author.id,
            username:
              post.author.username,
            avatar:
              post.author.avatar,
            role: post.author.role,
          }
        : null,
    };
  }
}
