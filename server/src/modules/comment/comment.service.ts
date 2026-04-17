import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { NotificationGateway } from '../../notification/notification.gateway';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    private notificationGateway: NotificationGateway,
    private notificationService: NotificationService,

  ) {}

  async create(content: string, userId: number, postId: number) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  const post = await this.postRepo.findOne({
    where: { id: postId },
    relations: ['author'],
  });

  if (!user || !post) {
    throw new Error('User or Post not found');
  }

  const comment = this.commentRepo.create({
    content,
    author: user,
    post: post,
  });

  const saved = await this.commentRepo.save(comment);


await this.notificationService.create(
  post.author.id,
  `New comment: ${content}`,
);

//  SEND REAL-TIME
this.notificationGateway.sendNotification(
  post.author.id,
  `New comment: ${content}`,
);

return saved;
}

  findByPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
    });
  }
}