import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import {
  FileInterceptor,
} from "@nestjs/platform-express";

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
  @UseInterceptors(
    FileInterceptor(
      "file",
      {
        dest:
          "./uploads",
      },
    ),
  )
  send(
    @Param("id")
    id: string,

    @Req()
    req,

    @Body()
    body: any,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.chatService.send(
      req.user.userId,
      Number(id),
      body.text,
      file,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(":id")
  edit(
    @Param("id")
    id: string,

    @Body()
    body: any,
  ) {
    return this.chatService.edit(
      Number(id),
      body.text,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Delete(":id")
  remove(
    @Param("id")
    id: string,
  ) {
    return this.chatService.remove(
      Number(id),
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Get()
  recent(
    @Req()
    req,
  ) {
    return this.chatService.getRecentChats(
      req.user.userId,
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