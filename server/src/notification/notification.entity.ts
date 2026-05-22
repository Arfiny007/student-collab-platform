import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm";

import {
  User,
} from "../modules/user/user.entity";

@Entity()

@Index([
  "createdAt",
])

export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
  })
  message: string;

  @Column({
    default: false,
  })
  isRead: boolean;

  @ManyToOne(
    () => User,
    {
      eager: true,
    },
  )
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}