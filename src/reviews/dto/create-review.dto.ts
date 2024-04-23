import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCodeReviewDto {
  @IsNotEmpty()
  commitId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @IsNumber()
  @IsNotEmpty()
  endIndex: number;
}
