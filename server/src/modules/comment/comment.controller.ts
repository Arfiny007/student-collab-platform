import {
  Controller,
  Post as HttpPost,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

@HttpPost()
@UseGuards(JwtAuthGuard)
create(@Body() body: any, @Req() req) {
  return this.commentService.create(
    body,
    req.user.userId,
    body.postId   // ✅ FIX HERE
  );
}

  @Get(':postId')
  getByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(Number(postId));
  }
}