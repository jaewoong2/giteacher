import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Commit } from './commit.entity';

@Entity()
export class CommitDetail {
  @PrimaryGeneratedColumn()
  commitDetailID: number;

  @OneToOne(() => Commit)
  commit: Commit;

  @Column({ nullable: true, type: 'text' })
  detail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
