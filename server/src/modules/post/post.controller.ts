import {
  Controller,
  Post as HttpPost,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Post,
  Query,
  Body,
} from "@nestjs/common";

import {
  FileInterceptor,
} from "@nestjs/platform-express";

import { PostService } from "./post.service";

import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import type { Multer } from "multer";

@Controller("posts")
export class PostController {
  constructor(
    private postService: PostService,
  ) {}

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    ":id/toggle-like",
  )
  toggleLike(
    @Param("id")
    id: string,

    @Req()
    req,
  ) {
    return this.postService.toggleLike(
      Number(id),
      req.user.userId,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    ":id/save",
  )
  toggleSave(
    @Param("id")
    id: string,

    @Req()
    req,
  ) {
    return this.postService.toggleSave(
      Number(id),
      req.user.userId,
    );
  }

  @HttpPost()
  @UseGuards(
    JwtAuthGuard,
  )
  @UseInterceptors(
    FileInterceptor(
      "file",
      {
        dest:
          "./uploads",
      },
    ),
  )
  create(
    @UploadedFile()
    file: Express.Multer.File,

    @Body()
    body: any,

    @Req()
    req,
  ) {
    return this.postService.create(
      body,
      req.user.userId,
      file,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Post(
    "vote/:id",
  )
  vote(
    @Param("id")
    id: string,

    @Req()
    req,
  ) {
    return this.postService.vote(
      Number(id),
      req.user.userId,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Get()
  getAll(
    @Req()
    req,

    @Query("page")
    page = 1,
  ) {
    return this.postService.findAll(
      req.user.userId,
      Number(page),
    );
  }

  @Get(
    "explore",
  )
  explore() {
    return this.postService.explore();
  }

  @Get(
    "trending",
  )
  hashtags() {
    return this.postService.trendingHashtags();
  }
  @UseGuards(
  JwtAuthGuard,
)
@Get(
  "saved/me",
)
saved(
  @Req()
  req,
) {
  return this.postService.getSavedPosts(
    req.user.userId,
  );
}
}