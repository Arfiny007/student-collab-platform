import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
} from "typeorm";

import {
  User,
} from "../user/user.entity";

import {
  Poll,
} from "./poll.entity";

@Entity()

@Index([
  "createdAt",
])

export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: "text",
  })
  content: string;

  @Column({
    default: 0,
  })
  likes: number;

  @Column({
    default: 0,
  })
  views: number;

  @Column({
    default: 0,
  })
  reports: number;

  @Column({
    default: false,
  })
  hidden: boolean;

  @Column({
    nullable: true,
  })
  image?: string;

  @Column({
    nullable: true,
  })
  file?: string;

  @ManyToOne(
    () => User,
    {
      eager: true,
    },
  )
  author: User;

  @OneToMany(
    () => Poll,
    (poll) =>
      poll.post,
    {
      cascade:
        true,
    },
  )
  polls: Poll[];

  @CreateDateColumn()
  createdAt: Date;
}