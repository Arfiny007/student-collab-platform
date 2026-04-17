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

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  create(
    @Body() body: { content: string; postId: number },
    @Req() req,
  ) {
    return this.commentService.create(
      body.content,
      req.user.userId,
      body.postId,
    );
  }

  @Get(':postId')
  getByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(Number(postId));
  }
}