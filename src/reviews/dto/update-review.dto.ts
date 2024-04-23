import { IsString, IsOptional } from 'class-validator';

export class UpdateCodeReviewDto {
  @IsOptional()
  @IsString()
  content?: string;
}
