import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { User } from "./user.entity";

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  media: string;

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