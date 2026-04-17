import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
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
  findAll() {
    return this.postRepo.find();
  }
}