import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  phone: string;

  // NEW PROFILE FIELDS

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  university?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  portfolio?: string;

  @Column({ nullable: true })
  skills?: string;
}