import {
  Controller,
  Post as HttpPost,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  create(
    @Body() body: { title: string; content: string },
    @Req() req,
  ) {
    return this.postService.create(
        body.title,
        body.content,
        req.user.userId,
    );
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }
}