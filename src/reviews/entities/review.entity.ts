import { Commit } from 'src/commits/entities/commit.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CodeReview {
  @PrimaryGeneratedColumn()
  codeReviewID: number;

  @ManyToOne(() => Commit, (commit) => commit.commitID)
  commit: Commit;

  @Column()
  fileName: string;

  @Column()
  startIndex: number;

  @Column()
  endIndex: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
