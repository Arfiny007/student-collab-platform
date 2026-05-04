import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { User } from "../modules/user/user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  text?: string;

  @Column({
    nullable: true,
  })
  file?: string;

  @Column({
    default: false,
  })
  seen: boolean;

  @Column({
    default: false,
  })
  edited: boolean;

  @Column({
    default: false,
  })
  deleted: boolean;

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