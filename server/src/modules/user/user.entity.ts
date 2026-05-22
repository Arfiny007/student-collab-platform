import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from "typeorm";

export enum UserRole {
  USER = "user",
  TEACHER = "teacher",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

@Entity()

@Index([
  "email",
])

@Index([
  "username",
])

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
    type: "enum",

    enum:
      UserRole,

    default:
      UserRole.USER,
  })
  role: UserRole;

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
    type: "text",
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
    type: "text",
  })
  skills?: string;

  @Column({
    default: false,
  })
  isPrivate: boolean;

  @Column({
    default: false,
  })
  isOnline: boolean;

  @Column({
    type:
      "timestamp",

    nullable:
      true,
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

  @Column({
    default: 0,
  })
  profileViews: number;

  @Column({
    default: 0,
  })
  engagementScore: number;
}