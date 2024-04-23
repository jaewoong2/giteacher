import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class CommitDetails {
  @IsNotEmpty()
  @IsString()
  author: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class CreateCommitDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CommitDetails)
  commit: CommitDetails;

  @IsString()
  @IsNotEmpty()
  html_url: string;

  @IsString()
  @IsNotEmpty()
  sha: string;

  @IsNumber()
  @IsNotEmpty()
  repositoryId: number;
}
