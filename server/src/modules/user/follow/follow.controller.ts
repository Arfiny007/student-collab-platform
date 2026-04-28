import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  toggle(@Param('id') id: string, @Req() req) {
    return this.followService.toggleFollow(
      req.user.userId,
      Number(id),
    );
  }
}