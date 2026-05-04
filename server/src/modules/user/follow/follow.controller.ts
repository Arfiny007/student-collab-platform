import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';

import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('follow')
export class FollowController {
  constructor(
    private followService: FollowService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  toggle(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.followService.toggleFollow(
      req.user.userId,
      Number(id),
    );
  }

  // FOLLOWERS
  @Get(':id/followers')
  followers(
    @Param('id') id: string,
  ) {
    return this.followService.getFollowers(
      Number(id),
    );
  }

  // FOLLOWING
  @Get(':id/following')
  following(
    @Param('id') id: string,
  ) {
    return this.followService.getFollowing(
      Number(id),
    );
  }
}