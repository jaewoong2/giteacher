import { IsNotEmpty, IsString } from 'class-validator';

export class FindRepoParamDto {
  @IsString()
  @IsNotEmpty()
  githubId: string;

  @IsString()
  @IsNotEmpty()
  repoName: string;
}
