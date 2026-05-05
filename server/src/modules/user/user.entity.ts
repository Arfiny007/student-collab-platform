import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: "user",
  })
  role: string;

  @Column()
  username: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  avatar?: string;

  @Column({
    nullable: true,
  })
  bio?: string;

  @Column({
    nullable: true,
  })
  university?: string;

  @Column({
    nullable: true,
  })
  department?: string;

  @Column({
    nullable: true,
  })
  location?: string;

  @Column({
    nullable: true,
  })
  github?: string;

  @Column({
    nullable: true,
  })
  linkedin?: string;

  @Column({
    nullable: true,
  })
  portfolio?: string;

  @Column({
    nullable: true,
  })
  skills?: string;

  // NEW

  @Column({
    default: false,
  })
  isPrivate: boolean;

  @Column({
    default: false,
  })
  isOnline: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  lastSeen?: Date;

  @Column({
    default: 0,
  })
  reportCount: number;

  @Column({
    default: false,
  })
  isBlocked: boolean;

  @Column({
    default: false,
  })
  isMuted: boolean;
}