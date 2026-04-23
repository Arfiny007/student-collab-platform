import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { Like } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post ,User, Like])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}