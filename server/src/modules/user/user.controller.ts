import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors,
  Param,
  Query,
} from "@nestjs/common";

import {
  FileInterceptor,
} from "@nestjs/platform-express";

import { UserService } from "./user.service";

import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Post(
    "register",
  )
  register(
    @Body()
    body: any,
  ) {
    return this.userService.register(
      body,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Get(
    "me",
  )
  me(
    @Req()
    req,
  ) {
    return this.userService.getProfile(
      req.user.userId,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Patch(
    "me",
  )
  @UseInterceptors(
    FileInterceptor(
      "avatar",
      {
        dest:
          "./uploads",
      },
    ),
  )
  update(
    @Req()
    req,
    @Body()
    body: any,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.userService.updateProfile(
      req.user.userId,
      body,
      file,
    );
  }

  @UseGuards(
    JwtAuthGuard,
  )
  @Post(
    "story",
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
  story(
    @Req()
    req,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.userService.createStory(
      req.user.userId,
      file,
    );
  }

  @Get(
    "stories",
  )
  stories() {
    return this.userService.getStories();
  }
  @UseGuards(
  JwtAuthGuard,
)
@Get(
  "analytics",
)
analytics(
  @Req()
  req,
) {
  return this.userService.getAnalytics(
    req.user.userId,
  );
}

  @UseGuards(
    JwtAuthGuard,
  )
  @Get(
    "suggested",
  )
  suggested(
    @Req()
    req,
  ) {
    return this.userService.suggestedUsers(
      req.user.userId,
    );
  }

  @Get(
    "search",
  )
  search(
    @Query("q")
    q: string,
  ) {
    return this.userService.searchUsers(
      q ||
        "",
    );
  }

  @UseGuards(
  JwtAuthGuard,
)
@Get(
  "saved",
)
saved(
  @Req()
  req,
) {
  return this.userService.getSavedPosts(
    req.user.userId,
  );
}

  @Get(
    ":id",
  )
  profile(
    @Param("id")
    id: string,
  ) {
    return this.userService.getProfile(
      Number(
        id,
      ),
    );
  }

  @Get(
    ":id/posts",
  )
  posts(
    @Param("id")
    id: string,
  ) {
    return this.userService.getUserPosts(
      Number(
        id,
      ),
    );
  }
}