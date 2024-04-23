// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateUserRepositoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  html_url: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  isPrivate: boolean;
}
