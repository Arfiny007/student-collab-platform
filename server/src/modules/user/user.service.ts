import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Follow } from './follow/follow.entity';
import { Post } from '../post/post.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,

    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(
      data.password,
      10,
    );

    const user = this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      username: data.username,
      phone: data.phone,
    });

    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  // PROFILE

  async getProfile(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const followers =
      await this.followRepo.count({
        where: {
          following: { id },
        },
      });

    const following =
      await this.followRepo.count({
        where: {
          follower: { id },
        },
      });

    const posts =
      await this.postRepo.count({
        where: {
          author: { id },
        },
      });

    return {
      ...user,
      followers,
      following,
      posts,
    };
  }

  async updateProfile(
    id: number,
    body: any,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (file) {
      user.avatar = file.filename;
    }

    Object.assign(user, body);

    await this.userRepo.save(user);

    return this.getProfile(id);
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
}