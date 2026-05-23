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
  BadRequestException,
} from "@nestjs/common";

import {
  FileInterceptor,
} from "@nestjs/platform-express";

import {
  JwtAuthGuard,
} from "../auth/jwt-auth.guard";

import {
  ChatService,
} from "./chat.service";
import { multerOptions } from "../config/multer.config";

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
    FileInterceptor("file", multerOptions),
  )
  async send(
    @Param("id")
    id: string,

    @Req()
    req: any,

    @Body()
    body: any,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    if (file) {
      const allowed = [
        "image/jpeg",
        "image/png",
        "application/pdf",
      ];

      if (
        !allowed.includes(
          file.mimetype,
        )
      ) {
        throw new BadRequestException(
          "Invalid file type",
        );
      }
    }

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
  @Patch(
    ":id/react",
  )
  react(
    @Param("id")
    id: string,

    @Body()
    body: any,
  ) {
    return this.chatService.react(
      Number(id),
      body.emoji,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    ":id/pin",
  )
  pin(
    @Param("id")
    id: string,
  ) {
    return this.chatService.togglePin(
      Number(id),
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    ":id/archive",
  )
  archive(
    @Param("id")
    id: string,
  ) {
    return this.chatService.toggleArchive(
      Number(id),
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    ":id",
  )
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
  @Delete(
    ":id",
  )
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
    req: any,
  ) {
    return this.chatService.getRecentChats(
      req.user.userId,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Get(
    ":id",
  )
  history(
    @Param("id")
    id: string,

    @Req()
    req: any,
  ) {
    return this.chatService.getConversation(
      req.user.userId,
      Number(id),
    );
  }
}