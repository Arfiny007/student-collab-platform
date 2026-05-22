import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";

import {
  User,
} from "../user/user.entity";

import {
  Post,
} from "../post/post.entity";

@Entity()

@Index([
  "content",
])

export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
  })
  content: string;

  @Column({
    default: 0,
  })
  reports: number;

  @Column({
    default: false,
  })
  hidden: boolean;

  @ManyToOne(
    () => User,
    {
      eager: true,
    },
  )
  author: User;

  @ManyToOne(
    () => Post,
    {
      onDelete:
        "CASCADE",
    },
  )
  post: Post;
}