import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { GithubUser } from 'src/auth/auth.service';
import { CreateUserRepositoryDto } from './dto/create-repository.dto';
import { FindRepoParamDto } from './dto/find-repository.dto';

@Controller('api/repository')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() { user }: { user: GithubUser }) {
    return this.repositoriesService.findAllRepository(
      user.githubId,
      user.access_token,
    );
  }

  @Get(':githubId/:repoName')
  find(@Param() params: FindRepoParamDto) {
    return this.repositoriesService.findOneByName(params);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() { user }: { user: GithubUser }) {
    return await this.repositoriesService.findUsersRepositories(user.githubId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() { user }: { user: GithubUser },
    @Body() data: CreateUserRepositoryDto,
  ) {
    return this.repositoriesService.createUserRepository(user.githubId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repositoriesService.remove(+id);
  }
}
