import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  InjectRepository,
} from "@nestjs/typeorm";

import {
  Repository,
} from "typeorm";

import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { Like } from "./like.entity";
import { Poll } from "./poll.entity";
import { Vote } from "./vote.entity";
import { Follow } from "../user/follow/follow.entity";
import { Save } from "./save.entity";
import { Multer } from "multer";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    @InjectRepository(Poll)
    private pollRepo: Repository<Poll>,

    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,

    @InjectRepository(Like)
    private likeRepo: Repository<Like>,

    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,

    @InjectRepository(Save)
    private saveRepo: Repository<Save>,
  ) {}

  async create(
    body: any,
    userId: number,
    file?: Express.Multer.File,
  ) {
    const user =
      await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new NotFoundException();
    }

    let image;
    let filePath;

    if (file) {
      if (
        file.mimetype.startsWith(
          "image",
        )
      ) {
        image =
          file.filename;
      } else {
        filePath =
          file.filename;
      }
    }

    const post =
      this.postRepo.create({
        title:
          body.title,
        content:
          body.content,
        author:
          user,
        image,
        file:
          filePath,
      });

    const savedPost =
      await this.postRepo.save(
        post,
      );

    if (
      body.options
    ) {
      const options =
        JSON.parse(
          body.options,
        );

      const polls =
        options
          .filter(
            (
              x,
            ) =>
              x.trim() !==
              "",
          )
          .map(
            (
              x,
            ) =>
              this.pollRepo.create(
                {
                  option:
                    x,
                  post:
                    savedPost,
                },
              ),
          );

      await this.pollRepo.save(
        polls,
      );
    }

    return this.postRepo.findOne({
      where: {
        id: savedPost.id,
      },
      relations: [
        "author",
        "polls",
      ],
    });
  }

  async vote(
    pollId: number,
    userId: number,
  ) {
    const poll =
      await this.pollRepo.findOne({
        where: {
          id: pollId,
        },
        relations: [
          "post",
        ],
      });

    const user =
      await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

    if (
      !poll ||
      !user
    ) {
      throw new NotFoundException();
    }

    const votes =
      await this.voteRepo.find({
        where: {
          user:
            {
              id:
                userId,
            },
        },
        relations: [
          "poll",
          "poll.post",
        ],
      });

    const existing =
      votes.find(
        (
          v,
        ) =>
          v.poll.post
            .id ===
          poll.post
            .id,
      );

    if (
      existing &&
      existing.poll
        .id ===
        pollId
    ) {
      return this.pollRepo.find({
        where: {
          post:
            {
              id:
                poll.post
                  .id,
            },
        },
      });
    }

    if (
      existing
    ) {
      existing.poll.votes--;

      await this.pollRepo.save(
        existing.poll,
      );

      await this.voteRepo.remove(
        existing,
      );
    }

    const vote =
      this.voteRepo.create({
        user,
        poll,
      });

    await this.voteRepo.save(
      vote,
    );

    poll.votes++;

    await this.pollRepo.save(
      poll,
    );

    return this.pollRepo.find({
      where: {
        post: {
          id: poll.post.id,
        },
      },
    });
  }

  async toggleLike(
    postId: number,
    userId: number,
  ) {
    const post =
      await this.postRepo.findOne({
        where: {
          id: postId,
        },
      });

    const user =
      await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

    if (
      !post ||
      !user
    ) {
      throw new NotFoundException();
    }

    const existing =
      await this.likeRepo.findOne({
        where: {
          post: {
            id: postId,
          },
          user: {
            id: userId,
          },
        },
      });

    if (
      existing
    ) {
      await this.likeRepo.remove(
        existing,
      );
    } else {
      await this.likeRepo.save(
        this.likeRepo.create(
          {
            post,
            user,
          },
        ),
      );
    }

    const count =
      await this.likeRepo.count({
        where: {
          post: {
            id: postId,
          },
        },
      });

    return {
      liked:
        !existing,
      count,
    };
  }

  async likePost(
    id: number,
  ) {
    const post =
      await this.postRepo.findOne({
        where: {
          id,
        },
      });

    if (!post) {
      throw new NotFoundException();
    }

    post.likes++;

    return this.postRepo.save(
      post,
    );
  }

  async toggleSave(
    postId: number,
    userId: number,
  ) {
    const post =
      await this.postRepo.findOne({
        where: {
          id: postId,
        },
      });

    const user =
      await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

    if (
      !post ||
      !user
    ) {
      throw new NotFoundException();
    }

    const existing =
      await this.saveRepo.findOne({
        where: {
          post: {
            id: postId,
          },
          user: {
            id: userId,
          },
        },
      });

    if (
      existing
    ) {
      await this.saveRepo.remove(
        existing);

      return {
        saved:
          false,
      };
    }

    await this.saveRepo.save(
      this.saveRepo.create({
        post,
        user,
      }),
    );

    return {
      saved:
        true,
    };
  }

async findAll(
  userId: number,
  page = 1,
) {
  const limit = 5;

  const posts =
    await this.postRepo.find({
      where: {
        hidden: false,
      },

      relations: [
        "author",
        "polls",
      ],

      take:
        limit,

      skip:
        (page - 1) *
        limit,

      order: {
        id: "DESC",
      },
    });

  return Promise.all(
    posts.map(
      async (
        post,
      ) => {
        const likeCount =
          await this.likeRepo.count({
            where: {
              post: {
                id:
                  post.id,
              },
            },
          });

        const liked =
          await this.likeRepo.findOne({
            where: {
              post: {
                id:
                  post.id,
              },

              user: {
                id:
                  userId,
              },
            },
          });

        const saved =
          await this.saveRepo.findOne({
            where: {
              post: {
                id:
                  post.id,
              },

              user: {
                id:
                  userId,
              },
            },
          });

        const isFollowing =
          await this.followRepo.findOne({
            where: {
              follower: {
                id:
                  userId,
              },

              following: {
                id:
                  post
                    .author
                    .id,
              },
            },
          });

        const polls =
          post.polls?.map(
            (
              poll,
            ) => ({
              ...poll,

              votes:
                poll
                  .votes ||
                0,
            }),
          ) || [];

        return {
          ...post,

          polls,

          likeCount,

          liked:
            !!liked,

          saved:
            !!saved,

          isFollowing:
            !!isFollowing,

          shareUrl:
            `${
              process.env
                .FRONTEND_URL ||
              "http://localhost:3000"
            }/post/${post.id}`,
        };
      },
    ),
  );
}

  async explore() {
    return this.postRepo.find({
      relations: [
        "author",
        "polls",
      ],
      order: {
        likes:
          "DESC",
      },
      take: 20,
    });
  }

  async trendingHashtags() {
    const posts =
      await this.postRepo.find();

    const tags =
      new Map();

    for (
      const post of posts
    ) {
      const matches =
        post.content?.match(
          /#\w+/g,
        ) || [];

      for (
        const tag of matches
      ) {
        tags.set(
          tag,
          (tags.get(
            tag,
          ) || 0) +
            1,
        );
      }
    }

    return Array.from(
      tags.entries(),
    )
      .sort(
        (
          a,
          b,
        ) =>
          b[1] -
          a[1],
      )
      .slice(
        0,
        10,
      );
  }
  async getSavedPosts(
  userId: number,
) {
  const saves =
    await this.saveRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        "post",
        "post.author",
        "post.polls",
      ],
      order: {
        id: "DESC",
      },
    });

  return saves.map(
    (x) => x.post,
  );
}

async report(
  id: number,
) {
  const post =
    await this.postRepo.findOne(
      {
        where: {
          id,
        },
      },
    );

  if (
    !post
  ) {
    throw new NotFoundException();
  }

  post.reports +=
    1;

  return this.postRepo.save(
    post,
  );
}

async hide(
  id: number,
) {
  const post =
    await this.postRepo.findOne(
      {
        where: {
          id,
        },
      },
    );

  if (
    !post
  ) {
    throw new NotFoundException();
  }

  post.hidden =
    !post.hidden;

  return this.postRepo.save(
    post,
  );
}
}