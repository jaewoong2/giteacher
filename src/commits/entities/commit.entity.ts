import { Repository } from 'src/repositories/entities/repository.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommitDetail } from './commit-detail.entity';
import { CodeReview } from 'src/reviews/entities/review.entity';

@Entity()
export class Commit {
  @PrimaryGeneratedColumn()
  commitID: number;

  @ManyToOne(() => Repository, (repository) => repository.commits, {
    lazy: true,
  })
  repository: Promise<Repository>;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ unique: true, nullable: false })
  url: string;

  @Column({ unique: true, nullable: false })
  sha: string;

  @ManyToOne(() => User, (user) => user.commits)
  author: User;

  @OneToOne(() => CommitDetail, {
    cascade: true,
  })
  @JoinColumn()
  commitDetail: CommitDetail;

  @OneToMany(() => CodeReview, (codereview) => codereview.commit)
  codeReview: CodeReview;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
