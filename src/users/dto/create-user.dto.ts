// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  githubId: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  @IsOptional()
  location: string;
}
