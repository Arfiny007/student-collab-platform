import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  InjectRepository,
} from "@nestjs/typeorm";

import {
  Repository,
  MoreThan,
} from "typeorm";

import * as bcrypt from "bcrypt";

import {
  User,
  UserRole,
} from "./user.entity";

import { Follow } from "./follow/follow.entity";

import { Post } from "../post/post.entity";

import { Story } from "./story.entity";
import { PostService } from "../post/post.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,

    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    @InjectRepository(Story)
    private storyRepo: Repository<Story>,
    private postService: PostService,
  ) {}

  async register(
  data: any,
) {
  const exists =
    await this.userRepo.findOne({
      where: {
        email:
          data.email,
      },
    });

  if (
    exists
  ) {
    throw new Error(
      "Email already exists",
    );
  }

  const hashed =
    await bcrypt.hash(
      data.password,
      10,
    );

  const user =
    this.userRepo.create({
      email:
        data.email,

      username:
        data.username,

      phone:
        data.phone,

      password:
        hashed,

      role:
        UserRole.USER,
    });

  return this.userRepo.save(
    user,
  );
}

  async findByEmail(
    email: string,
  ) {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async getProfile(
    id: number,
  ) {
    const user =
      await this.userRepo.findOne({
        where: {
          id,
        },
      });

    if (
      !user
    ) {
      throw new NotFoundException();
    }

    const followers =
      await this.followRepo.count({
        where: {
          following:
            { id },
        },
      });

    const following =
      await this.followRepo.count({
        where: {
          follower:
            { id },
        },
      });

    const posts =
      await this.postRepo.count({
        where: {
          author:
            { id },
        },
      });

    const fields = [
      user.avatar,
      user.bio,
      user.university,
      user.department,
      user.location,
      user.github,
      user.linkedin,
      user.skills,
    ];

    const completion =
      Math.round(
        (fields.filter(
          Boolean,
        ).length /
          fields.length) *
          100,
      );

    return {
      ...user,
      followers,
      following,
      posts,
      verified:
        posts >=
        5,
      completion,
    };
  }

  async updateProfile(
    id: number,
    body: any,
    file?: Express.Multer.File,
  ) {
    const user =
      await this.userRepo.findOne({
        where: {
          id,
        },
      });

    if (
      !user
    ) {
      throw new NotFoundException();
    }

    if (file) {
      user.avatar = file.filename;
    }

    Object.assign(user, body);

    await this.userRepo.save(user);

    return this.getProfile(id);
  }

  async createStory(
  userId: number,
  file: Express.Multer.File,
) {
  const user =
    await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

  if (
    !user
  ) {
    throw new NotFoundException();
  }

  const story =
    new Story();

  story.media =
    file.filename;

  story.user =
    user;

  return this.storyRepo.save(
    story,
  );
}

  async getStories() {
    const yesterday =
      new Date();

    yesterday.setHours(
      yesterday.getHours() -
        24,
    );

    return this.storyRepo.find({
      where: {
        createdAt:
          MoreThan(
            yesterday,
          ),
      },
      order: {
        id: "DESC",
      },
    });
  }

  async searchUsers(
    query: string,
  ) {
    return this.userRepo
      .createQueryBuilder(
        "user",
      )
      .where(
        "LOWER(user.username) LIKE LOWER(:q)",
        {
          q: `%${query}%`,
        },
      )
      .getMany();
  }

  async getUserPosts(
    id: number,
  ) {
    return this.postRepo.find({
      where: {
        author:
          { id },
      },
      relations: [
        "author",
        "polls",
      ],
      order: {
        id: "DESC",
      },
    });
  }

  async suggestedUsers(
    myId: number,
  ) {
    return this.userRepo
      .createQueryBuilder(
        "user",
      )
      .where(
        "user.id != :id",
        {
          id: myId,
        },
      )
      .take(
        5,
      )
      .getMany();
  }
  async getSavedPosts(
  userId: number,
) {
  return this.postService.getSavedPosts(
    userId,
  );
}


async trackProfileView(
  profileId: number,
) {
  const user =
    await this.userRepo.findOne({
      where: {
        id: profileId,
      },
    });

  if (!user) {
    return;
  }

  user.profileViews += 1;

  await this.userRepo.save(
    user,
  );
}
async analytics(
  userId: number,
) {
  const profile =
    await this.getProfile(
      userId,
    );

  return {
    views:
      profile.profileViews,

    followers:
      profile.followers,

    posts:
      profile.posts,

    engagement:
      profile.posts === 0
        ? 0
        : Math.round(
            (profile.followers /
              profile.posts) *
              100,
          ),
  };
}
}