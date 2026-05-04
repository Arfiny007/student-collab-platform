import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Message } from "./message.entity";

import { User } from "../modules/user/user.entity";

import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      User,
    ]),
  ],

  providers: [
    ChatGateway,
    ChatService,
  ],

  controllers: [
    ChatController,
  ],

  exports: [
    ChatGateway,
    ChatService,
  ],
})
export class ChatModule {}