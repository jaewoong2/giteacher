import { Inject, Injectable } from '@nestjs/common';
import { CreateCommitDto } from './dto/create-commit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Commit } from './entities/commit.entity';
import { Repository } from 'typeorm';
import { ServiceException } from 'src/core/filters/exception/service.exception';
import {
  ALREADY_EXIST_ERROR,
  AUTHORIZATION_ERROR,
} from 'src/core/filters/exception/error-code';
import { RepositoriesService } from 'src/repositories/repositories.service';
import { GithubUser } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { UseGitHubAPI, useGithubAPI } from 'src/core/utils/github';
import { CommitDetail } from './entities/commit-detail.entity';

export type CommitResponse = {
  sha: string;
  comments_url?: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
};

@Injectable()
export class CommitsService {
  constructor(
    @Inject(RepositoriesService)
    private readonly repositoryService: RepositoriesService,
    @InjectRepository(CommitDetail)
    private readonly commitDetailRepository: Repository<CommitDetail>,
    @InjectRepository(Commit)
    private readonly commitRepository: Repository<Commit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneBySha(sha: string) {
    const commit = this.commitRepository.findOne({
      where: { sha },
      relations: ['commitDetail', 'codeReview'],
    });

    return commit;
  }

  async getCommitDetail({ user, commit, repository }: UseGitHubAPI) {
    const { getCommitDiff } = useGithubAPI({
      user,
      commit,
      repository,
    });
    const response = await getCommitDiff<string>();

    return response;
  }

  async createCommitDetail(params: {
    commit: UseGitHubAPI['commit'];
    user: UseGitHubAPI['user'];
    repoName: string;
  }) {
    const detail = await this.getCommitDetail({
      commit: { sha: params.commit.sha },
      user: params.user,
      repository: { name: params.repoName },
    });

    const commit = await this.commitRepository.findOne({
      where: { sha: params.commit.sha },
    });

    if (!commit) {
      throw new Error('Commit not found'); // 오류 처리 추가
    }

    const newDetail = this.commitDetailRepository.create({
      commit: commit, // 바로 할당하는 방식을 사용
      detail: detail.data,
    });

    await this.commitDetailRepository.save(newDetail);

    await this.commitRepository.update(commit.commitID, {
      commitDetail: newDetail,
    });
  }

  async create({ commit, html_url, repositoryId, sha }: CreateCommitDto) {
    const oldCommit = await this.commitRepository.findOne({
      where: { url: html_url },
    });

    if (oldCommit) {
      throw new ServiceException(
        ALREADY_EXIST_ERROR,
        '이미 존재 하는 Commit 입니다.',
      );
    }

    const newCommit = this.commitRepository.create();
    const repo = await this.repositoryService.findOne(repositoryId);

    newCommit.author = await this.userRepository.findOne({
      where: { githubId: commit.author },
    });
    newCommit.message = commit.message;
    newCommit.url = html_url;
    newCommit.repository = Promise.resolve(repo);
    newCommit.sha = sha;

    await this.commitRepository.save(newCommit);

    return newCommit;
  }

  async getCommit({ user, commit, repository }: UseGitHubAPI, page = 1) {
    const { getCommits } = useGithubAPI({ user, commit, repository });

    const response = await getCommits<CommitResponse[]>(
      page,
      commit?.updatedAt?.toISOString(),
    );

    if (response.status > 300 || response.status > 200) {
      throw new ServiceException(
        AUTHORIZATION_ERROR,
        '깃허브 인증을 실패했습니다.',
      );
    }

    const responses = [...response.data];

    if (response.data.length >= 100) {
      const res = await this.getCommit({ user, commit, repository }, page + 1);

      responses.concat(res);

      return responses;
    }

    return responses;
  }

  async findAll({ user }: { user: GithubUser }) {
    const repositories = await this.repositoryService.findUsersRepositories(
      user.githubId,
    );

    return Promise.all(
      repositories.map(async (repository) => {
        // 레포지토리에서 커밋 목록을 읽고 (최신 이후 UpdatedAt 기준,)
        // @codereview 가 있으면 Commit DB에 쌓기
        const commit = await this.commitRepository.findOne({
          where: { repository: { id: repository.id } },
          order: { updatedAt: 'DESC' },
        });

        const response = await this.getCommit({ user, commit, repository });

        const pattern = /@codereview/i;
        const codeReviewRequests = response
          .filter(({ commit }) => {
            if (pattern.test(commit?.message)) {
              return true;
            }
            return false;
          })
          .map(({ commit, html_url, sha }) => ({
            sha,
            commit: {
              author: commit?.author,
              message: commit?.message,
            },
            html_url,
          }))
          .flat();

        return { codeReviewRequests, repository };
      }),
    );
  }

  findUsersCommits(user: Partial<User>) {
    return this.commitRepository.find({
      where: { author: { githubId: user.githubId } },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} commit`;
  }
}
