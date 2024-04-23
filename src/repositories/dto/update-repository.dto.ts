import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRepositoryDto } from './create-repository.dto';

export class UpdateRepositoryDto extends PartialType(CreateUserRepositoryDto) {}
