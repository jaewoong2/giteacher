import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Repository } from 'src/repositories/entities/repository.entity';
import { Commit } from 'src/commits/entities/commit.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  githubId: string;

  @Column({ unique: false })
  username: string;

  @Column()
  avatar: string;

  @Column()
  roleId: number;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Repository, (repository) => repository.user, { lazy: true })
  repositories: Promise<Repository[]>;

  @OneToMany(() => Commit, (commit) => commit.author, { lazy: true })
  commits: Promise<Commit[]>;

  @Column({ nullable: true })
  accessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
