import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  option: string;

  @Column({ default: 0 })
  votes: number;

  @ManyToOne(() => Post, (post) => post.polls, { onDelete: 'CASCADE' })
  post: Post;
}