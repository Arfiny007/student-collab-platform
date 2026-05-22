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
} from "./user.entity";

@Entity()

@Index([
  "createdAt",
])

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