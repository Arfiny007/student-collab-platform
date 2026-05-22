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

export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    type: "text",
  })
  text?: string;

  @Column({
    nullable: true,
  })
  file?: string;

  @Column({
    nullable: true,
  })
  reaction?: string;

  @Column({
    default: false,
  })
  seen: boolean;

  @Column({
    default: false,
  })
  delivered: boolean;

  @Column({
    default: false,
  })
  edited: boolean;

  @Column({
    default: false,
  })
  deleted: boolean;

  @Column({
    default: false,
  })
  pinned: boolean;

  @Column({
    default: false,
  })
  archived: boolean;

  @ManyToOne(
    () => User,
    {
      eager: true,
    },
  )
  sender: User;

  @ManyToOne(
    () => User,
    {
      eager: true,
    },
  )
  receiver: User;

  @CreateDateColumn()
  createdAt: Date;
}