import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { User } from '../modules/user/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(userId: number, message: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notif = this.notifRepo.create({
      message,
      user,
    });

    return this.notifRepo.save(notif);
  }

  findUserNotifications(userId: number) {
    return this.notifRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async markAsRead(id: number) {
    const notif = await this.notifRepo.findOne({ where: { id } });

    if (!notif) throw new NotFoundException();

    notif.isRead = true;
    return this.notifRepo.save(notif);
  }
}