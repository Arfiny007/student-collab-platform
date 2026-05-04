import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { Follow } from './follow/follow.entity';
import { Post } from '../post/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Follow,
      Post,
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}