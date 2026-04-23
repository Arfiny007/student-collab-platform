import {
  Controller,
  Post as HttpPost,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
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

  
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id/like')
  likePost(@Param('id') id: string) {
   return this.postService.likePost(Number(id));
}

@UseGuards(JwtAuthGuard)
@Patch(':id/toggle-like')
toggleLike(@Param('id') id: string, @Req() req) {
  return this.postService.toggleLike(
    Number(id),
    req.user.userId
  );
}

@UseGuards(JwtAuthGuard)
@Get()
getAll(@Req() req) {
  return this.postService.findAll(req.user.userId);
}
}