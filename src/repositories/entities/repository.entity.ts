import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Commit } from 'src/commits/entities/commit.entity';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  html_url: string;

  @Column()
  description: string;

  @Column({ type: 'boolean' })
  isPrivate: boolean;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => User, (user) => user.repositories)
  user: User;

  @OneToMany(() => Commit, (commit) => commit.repository, { lazy: true })
  commits: Promise<Commit[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
