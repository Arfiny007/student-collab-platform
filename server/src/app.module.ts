import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationModule } from './notification/notification.module';
import { FollowModule } from './modules/user/follow/follow.module';




@Module({
  imports: [
  TypeOrmModule.forRoot(typeOrmConfig),
  UserModule,
  AuthModule,
  PostModule,
  CommentModule,
  NotificationModule,
  FollowModule, 

],
  providers: [],
})
export class AppModule {}