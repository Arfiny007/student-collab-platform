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

import {
  JwtAuthGuard,
} from "../auth/jwt-auth.guard";

import {
  ChatService,
} from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {}

  // SEND MESSAGE
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
    req: any,

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

  // REACTION
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

  // PIN
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

  // ARCHIVE
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

  // EDIT
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

  // DELETE
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

  // RECENT CHATS
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

  // CHAT HISTORY
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