import {
  Module,
} from "@nestjs/common";

import {
  TypeOrmModule,
} from "@nestjs/typeorm";

import {
  ConfigModule,
} from "@nestjs/config";

import {
  typeOrmConfig,
} from "./config/typeorm.config";

import {
  UserModule,
} from "./modules/user/user.module";

import {
  AuthModule,
} from "./auth/auth.module";

import {
  PostModule,
} from "./modules/post/post.module";

import {
  CommentModule,
} from "./modules/comment/comment.module";

import {
  NotificationModule,
} from "./notification/notification.module";

import {
  FollowModule,
} from "./modules/user/follow/follow.module";

import {
  ChatModule,
} from "./chat/chat.module";

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal:
        true,
    }),

    TypeOrmModule.forRoot(
      typeOrmConfig,
    ),

    UserModule,

    AuthModule,

    PostModule,

    CommentModule,

    NotificationModule,

    FollowModule,

    ChatModule,

  ],
})
export class AppModule {}