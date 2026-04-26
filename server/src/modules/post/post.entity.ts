import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Poll } from './poll.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  file?: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @OneToMany(() => Poll, (poll) => poll.post, { cascade: true })
  polls: Poll[];
}