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

  // ✅ CREATE POST + POLL
  async create(body: any, userId: number, file?: Express.Multer.File) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    let image: string | undefined = undefined;
    let filePath: string | undefined = undefined;

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

    // ✅ CREATE POLL
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

      await this.pollRepo.save(polls);
    }

    return savedPost;
  }

  // ✅ VOTE
  async vote(pollId: number, userId: number) {
  const poll = await this.pollRepo.findOne({
    where: { id: pollId },
    relations: ['post'],
  });

  const user = await this.userRepo.findOne({
    where: { id: userId },
  });

  if (!poll || !user) throw new NotFoundException();

  // 🔒 LOCK: find existing vote for this POST (not poll)
  const existingVote = await this.voteRepo.findOne({
    where: {
      user: { id: userId },
      poll: {
        post: { id: poll.post.id },
      },
    },
    relations: ['poll', 'poll.post'],
  });

  // 🧠 IF SAME OPTION → do nothing
  if (existingVote && existingVote.poll.id === pollId) {
    return await this.pollRepo.find({
      where: { post: { id: poll.post.id } },
    });
  }

  // 🔁 REMOVE OLD VOTE
  if (existingVote) {
    existingVote.poll.votes = Math.max(0, existingVote.poll.votes - 1);
    await this.pollRepo.save(existingVote.poll);
    await this.voteRepo.remove(existingVote);
  }

  // ✅ ADD NEW VOTE
  const newVote = this.voteRepo.create({ user, poll });
  await this.voteRepo.save(newVote);

  poll.votes += 1;
  await this.pollRepo.save(poll);

  // 🔄 RETURN UPDATED POLLS
  return await this.pollRepo.find({
    where: { post: { id: poll.post.id } },
  });
}

  // ✅ GET POSTS
async findAll(userId: number, page: number = 1) {
  const limit = 5;
  const skip = (page - 1) * limit;

  const posts = await this.postRepo.find({
    relations: ['author', 'polls'],
    take: limit,
    skip: skip,
    order: { id: 'DESC' },
  });

  return Promise.all(
    posts.map(async (post) => {
      // 👍 like count
      const likeCount = await this.likeRepo.count({
        where: { post: { id: post.id } },
      });

      const liked = await this.likeRepo.findOne({
        where: {
          post: { id: post.id },
          user: { id: userId },
        },
      });

      // 🔥 FOLLOW CHECK (IMPORTANT)
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
        isFollowing: !!isFollowing, // ✅ THIS IS THE KEY
      };
    }),
  );
}

  // ✅ LIKE (OLD)
  async likePost(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
    });

    if (!post) throw new NotFoundException('Post not found');

    post.likes += 1;
    return this.postRepo.save(post);
  }

  // ✅ TOGGLE LIKE
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
      const like = this.likeRepo.create({ post, user });
      await this.likeRepo.save(like);
    }

    const count = await this.likeRepo.count({
      where: { post: { id: postId } },
    });

    const liked = await this.likeRepo.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    return {
      liked: !!liked,
      count,
    };
  }
}