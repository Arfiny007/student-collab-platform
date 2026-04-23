import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from './post.entity';

@Entity()
@Unique(['user', 'post']) // prevents duplicate likes
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;
}