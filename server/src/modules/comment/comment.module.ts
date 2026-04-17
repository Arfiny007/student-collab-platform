import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { NotificationModule } from '../../notification/notification.module';


@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post]),
  NotificationModule
],

  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}