import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Like } from './like.entity';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';
import { Follow } from '../user/follow/follow.entity';

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
  ) {}

  // CREATE POST
  async create(body: any, userId: number, file?: Express.Multer.File) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    let image: string | undefined;
    let filePath: string | undefined;

    if (file) {
      if (file.mimetype.startsWith('image')) {
        image = file.filename;
      } else {
        filePath = file.filename;
      }
    }

    const post = this.postRepo.create({
      title: body.title,
      content: body.content,
      author: user,
      image,
      file: filePath,
    });

    const savedPost = await this.postRepo.save(post);

    // CREATE POLLS
    if (body.options) {
      const options: string[] = JSON.parse(body.options);

      const polls = options
        .filter((opt) => opt.trim() !== '')
        .map((opt) =>
          this.pollRepo.create({
            option: opt,
            post: savedPost,
          }),
        );

      if (polls.length > 0) {
        await this.pollRepo.save(polls);
      }
    }

    // 🔥 THIS WAS MISSING
    return await this.postRepo.findOne({
      where: { id: savedPost.id },
      relations: ['author', 'polls'],
    });
  }

  // VOTE
  async vote(pollId: number, userId: number) {
  const poll = await this.pollRepo.findOne({
    where: { id: pollId },
    relations: ['post'],
  });

  const user = await this.userRepo.findOne({
    where: { id: userId },
  });

  if (!poll || !user) {
    throw new NotFoundException();
  }

  // 🔥 Get ALL votes of this user
  const userVotes = await this.voteRepo.find({
    where: {
      user: { id: userId },
    },
    relations: ['poll', 'poll.post'],
  });

  // 🔥 Find vote for THIS POST ONLY
  const existingVote = userVotes.find(
    (vote) => vote.poll.post.id === poll.post.id,
  );

  // ✅ same option clicked again → do nothing
  if (existingVote && existingVote.poll.id === pollId) {
    return await this.pollRepo.find({
      where: {
        post: { id: poll.post.id },
      },
    });
  }

  // ✅ switching vote
  if (existingVote) {
    existingVote.poll.votes = Math.max(
      0,
      existingVote.poll.votes - 1,
    );

    await this.pollRepo.save(existingVote.poll);

    await this.voteRepo.remove(existingVote);
  }

  // ✅ add new vote
  const newVote = this.voteRepo.create({
    user,
    poll,
  });

  await this.voteRepo.save(newVote);

  poll.votes += 1;

  await this.pollRepo.save(poll);

  // 🔥 return updated polls
  return await this.pollRepo.find({
    where: {
      post: { id: poll.post.id },
    },
    order: {
      id: 'ASC',
    },
  });
}

  // FEED
  async findAll(userId: number, page = 1) {
    const limit = 5;
    const skip = (page - 1) * limit;

    const posts = await this.postRepo.find({
      relations: ['author', 'polls'],
      take: limit,
      skip,
      order: { id: 'DESC' },
    });

    return Promise.all(
      posts.map(async (post) => {
        const likeCount = await this.likeRepo.count({
          where: { post: { id: post.id } },
        });

        const liked = await this.likeRepo.findOne({
          where: {
            post: { id: post.id },
            user: { id: userId },
          },
        });

        const isFollowing = await this.followRepo.findOne({
          where: {
            follower: { id: userId },
            following: { id: post.author.id },
          },
        });

        return {
          ...post,
          likeCount,
          liked: !!liked,
          isFollowing: !!isFollowing,
        };
      }),
    );
  }

  async likePost(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
    });

    if (!post) throw new NotFoundException();

    post.likes += 1;
    return this.postRepo.save(post);
  }

  async toggleLike(postId: number, userId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
    });

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!post || !user) throw new NotFoundException();

    const existing = await this.likeRepo.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (existing) {
      await this.likeRepo.remove(existing);
    } else {
      const like = this.likeRepo.create({
        post,
        user,
      });

      await this.likeRepo.save(like);
    }

    const count = await this.likeRepo.count({
      where: { post: { id: postId } },
    });

    return {
      liked: !existing,
      count,
    };
  }
  async getUserPosts(userId: number) {
  return this.postRepo.find({
    where: {
      author: { id: userId },
    },
    relations: ['author', 'polls'],
    order: {
      id: 'DESC',
    },
  });
}

async searchUsers(query: string) {
  return this.userRepo
    .createQueryBuilder('user')
    .where(
      'LOWER(user.username) LIKE LOWER(:query)',
      {
        query: `%${query}%`,
      },
    )
    .orWhere(
      'LOWER(user.email) LIKE LOWER(:query)',
      {
        query: `%${query}%`,
      },
    )
    .getMany();
}
}