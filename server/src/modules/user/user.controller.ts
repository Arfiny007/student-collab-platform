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
import { multerOptions } from "../../config/multer.config";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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
    body: CreateUserDto,
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
    FileInterceptor("avatar", multerOptions),
  )
  update(
    @Req()
    req,
    @Body()
    body: UpdateUserDto,
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
    FileInterceptor("file", multerOptions),
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
  return this.userService.analytics(
    req.user.userId,
  );
}

  @Get(
  ":id",
)
async profile(
  @Param("id")
  id: string,
) {
  await this.userService.trackProfileView(
    Number(id),
  );

  return this.userService.getProfile(
    Number(id),
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