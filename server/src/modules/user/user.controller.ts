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
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Post('register')
  register(
    @Body() body: CreateUserDto,
  ) {
    return this.userService.register(body);
  }

  // MY PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    return this.userService.getProfile(
      req.user.userId,
    );
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      dest: './uploads',
    }),
  )
  update(
    @Req() req,
    @Body() body: any,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.userService.updateProfile(
      req.user.userId,
      body,
      file,
    );
  }

  // SEARCH USERS
  @Get('search')
  search(
    @Query('q') q: string,
  ) {
    return this.userService.searchUsers(
      q || '',
    );
  }

  // PUBLIC PROFILE
  @Get(':id')
  publicProfile(
    @Param('id') id: string,
  ) {
    return this.userService.getProfile(
      Number(id),
    );
  }

  // USER POSTS
  @Get(':id/posts')
  posts(
    @Param('id') id: string,
  ) {
    return this.userService.getUserPosts(
      Number(id),
    );
  }
}