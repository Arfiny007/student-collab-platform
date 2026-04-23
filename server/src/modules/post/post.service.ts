import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Like } from './like.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
  ) {}

 async create(title: string, content: string, userId: number) {
  const user = await this.userRepo.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  const post = this.postRepo.create({
    title,
    content,
    author: user,
  });

  return this.postRepo.save(post);
}
  async findAll(userId: number) {
  const posts = await this.postRepo.find({
    relations: ['author'],
  });

  return Promise.all(
    posts.map(async (post) => {
      const count = await this.likeRepo.count({
        where: { post: { id: post.id } },
      });

      const liked = await this.likeRepo.findOne({
        where: {
          post: { id: post.id },
          user: { id: userId },
        },
      });

      return {
        ...post,
        likeCount: count,
        liked: !!liked,
      };
    }),
  );
}

  async likePost(id: number) {
  const post = await this.postRepo.findOne({ where: { id } });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  post.likes += 1;
  return this.postRepo.save(post);
}

async toggleLike(postId: number, userId: number) {
  const post = await this.postRepo.findOne({ where: { id: postId } });
  const user = await this.userRepo.findOne({ where: { id: userId } });

  if (!post || !user) {
    throw new NotFoundException();
  }

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