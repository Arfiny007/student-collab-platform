import {
  Controller,
  Post as HttpPost,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  
  
  
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

@HttpPost()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
create(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
  @Req() req,
) {
  return this.postService.create(body, req.user.userId, file);
}
}