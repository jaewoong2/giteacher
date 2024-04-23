import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommitsService } from './commits.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { GithubUser } from 'src/auth/auth.service';

@Controller('api/commits')
export class CommitsController {
  constructor(private readonly commitsService: CommitsService) {}

  @Get('/:sha')
  @UseGuards(JwtAuthGuard)
  async findOneBySha(@Param('sha') sha: string) {
    return await this.commitsService.findOneBySha(sha);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() { user }: { user: GithubUser }) {
    return await this.commitsService.findUsersCommits(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async findAllAndCreate(@Req() { user }: { user: GithubUser }) {
    const commits = await this.commitsService.findAll({ user });

    commits.forEach(({ codeReviewRequests, repository }) => {
      codeReviewRequests.forEach(async ({ commit, html_url, sha }) => {
        const newCommit = await this.commitsService.create({
          commit: {
            author: commit.author?.name,
            message: commit.message,
          },
          html_url: html_url,
          repositoryId: repository.id,
          sha,
        });

        await this.commitsService.createCommitDetail({
          user,
          commit: newCommit,
          repoName: repository.name,
        });
      });
    });

    return commits;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commitsService.remove(+id);
  }
}
