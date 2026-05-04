import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {}

  @UseGuards(
    JwtAuthGuard,
  )
  @Post(":id")
  send(
    @Param("id")
    id: string,

    @Req()
    req,

    @Body()
    body: any,
  ) {
    return this.chatService.send(
      req.user.userId,
      Number(id),
      body.text,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Get(":id")
  history(
    @Param("id")
    id: string,

    @Req()
    req,
  ) {
    return this.chatService.getConversation(
      req.user.userId,
      Number(id),
    );
  }
}