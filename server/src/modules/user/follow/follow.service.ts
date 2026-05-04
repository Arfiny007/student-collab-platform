import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follow } from './follow.entity';
import { User } from '../user.entity';
import { NotificationService } from '../../../notification/notification.service';
import { NotificationGateway } from '../../../notification/notification.gateway';
@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    // ✅ CORRECT INJECTION
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  async toggleFollow(userId: number, targetId: number) {
    // ❌ prevent self follow
    if (userId === targetId) {
      throw new Error("You cannot follow yourself");
    }

    const follower = await this.userRepo.findOne({
      where: { id: userId },
    });

    const following = await this.userRepo.findOne({
      where: { id: targetId },
    });

    if (!follower || !following) {
      throw new NotFoundException("User not found");
    }

    const existing = await this.followRepo.findOne({
      where: {
        follower: { id: userId },
        following: { id: targetId },
      },
    });

    // 🔁 UNFOLLOW
    if (existing) {
      await this.followRepo.remove(existing);
      return { following: false };
    }

    // ✅ FOLLOW
    const follow = this.followRepo.create({
      follower,
      following,
    });

    await this.followRepo.save(follow);

    // 🔔 SAVE NOTIFICATION
    await this.notificationService.create(
      following.id,
      `${follower.email} started following you`
    );

    // ⚡ REAL-TIME NOTIFICATION
    this.notificationGateway.server
      .to(`user-${following.id}`)
      .emit("notification", `${follower.email} followed you`);

    return { following: true };
  }
  async getFollowers(userId: number) {
  return this.followRepo.find({
    where: {
      following: { id: userId },
    },
  });
}

async getFollowing(userId: number) {
  return this.followRepo.find({
    where: {
      follower: { id: userId },
    },
  });
}
}