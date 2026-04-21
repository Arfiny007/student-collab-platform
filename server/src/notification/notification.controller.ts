import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Patch, Param } from '@nestjs/common';
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyNotifications(@Req() req) {
    return this.notificationService.findUserNotifications(req.user.userId);
  }

 @UseGuards(JwtAuthGuard)
@Patch(':id/read')
markRead(@Param('id') id: string) {
  return this.notificationService.markAsRead(Number(id));
}
}