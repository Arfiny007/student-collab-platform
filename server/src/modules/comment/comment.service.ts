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

  async create(body: any, userId: number, postId: number) {
  if (!body.content || body.content.trim() === '') {
  throw new Error('Comment content is required');
}

if (!postId) {
  throw new Error('Post ID is required');
}
  const user = await this.userRepo.findOne({ where: { id: userId } });
  const post = await this.postRepo.findOne({
    where: { id: postId },
    relations: ['author'],
  });

  if (!user || !post) {
    throw new Error('User or Post not found');
  }

  const comment = this.commentRepo.create({
    content: body.content,
    author: user,
    post,
  });

  const savedComment = await this.commentRepo.save(comment);

  // ✅ SAVE NOTIFICATION
  await this.notificationService.create(
    post.author.id,
    `${user.email} commented: ${body.content}`
  );

  // ✅ REALTIME NOTIFICATION
  this.notificationGateway.server
    .to(`user-${post.author.id}`)
    .emit('notification', `${user.email} commented on your post`);

  return savedComment;
}

  findByPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
    });
  }
}