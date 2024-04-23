import { IsOptional, IsString } from 'class-validator';

export class GithubAuthDto {
  @IsString()
  readonly code: string;

  @IsString()
  @IsOptional()
  readonly redirectUrl?: string;
}
