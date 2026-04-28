import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { User } from '../user.entity';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { NotificationModule } from '../../../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow, User]),
    NotificationModule, 
  ],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}