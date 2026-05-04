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

  @Column()
  text: string;

  @Column({
    default: false,
  })
  seen: boolean;

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