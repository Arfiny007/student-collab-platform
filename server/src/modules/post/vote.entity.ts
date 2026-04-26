import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Poll } from './poll.entity';

@Unique(['user', 'poll'])
@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Poll, { onDelete: 'CASCADE' })
  poll: Poll;
}