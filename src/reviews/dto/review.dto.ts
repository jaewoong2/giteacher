import { Commit } from 'src/commits/entities/commit.entity';

export class CodeReviewResponseDto {
  codeReviewID: number;
  commit: Commit;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  fileName: string;
  startIndex: number;
  endIndex: number;
}
