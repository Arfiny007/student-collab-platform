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
  BadRequestException,
} from "@nestjs/common";

import {
  FileInterceptor,
} from "@nestjs/platform-express";

import {
  PostService,
} from "./post.service";

import {
  JwtAuthGuard,
} from "../../auth/jwt-auth.guard";
import { multerOptions } from "../../config/multer.config";

@Controller(
  "posts",
)
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

  @UseGuards(
    JwtAuthGuard,
  )
  @HttpPost()
  @UseInterceptors(
    FileInterceptor("file", multerOptions),
  )
  async create(
    @UploadedFile()
    file:
      | Express.Multer.File
      | undefined,

    @Body()
    body: any,

    @Req()
    req,
  ) {
    if (
      file
    ) {
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

    if (
      !body.title?.trim() &&
      !body.content?.trim()
    ) {
      throw new BadRequestException(
        "Post cannot be empty",
      );
    }

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

    @Query(
      "page",
    )
    page = 1,
  ) {
    return this.postService.findAll(
      req.user.userId,
      Number(
        page,
      ),
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

  // moderation

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    ":id/report",
  )
  report(
    @Param("id")
    id: string,
  ) {
    return this.postService.report(
      Number(
        id,
      ),
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    ":id/hide",
  )
  hide(
    @Param("id")
    id: string,
  ) {
    return this.postService.hide(
      Number(
        id,
      ),
    );
  }
}