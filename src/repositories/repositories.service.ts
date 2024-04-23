import { Inject, Injectable } from '@nestjs/common';
import { Repository as RepoEntitiy } from './entities/repository.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserRepositoryDto } from './dto/create-repository.dto';
import { User } from 'src/users/entities/user.entity';
import { EventBridgeService } from 'src/core/eventbridge.service';
import { useGithubAPI } from 'src/core/utils/github';
import { FindRepoParamDto } from './dto/find-repository.dto';

type RepositoryResponse = {
  description: string;
  html_url: string;
  name: string;
  full_name: string;
  private: boolean;
};

type FindAllRepositoryResponse = Omit<RepositoryResponse, 'private'> & {
  isPrivate: boolean;
};

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectRepository(RepoEntitiy)
    private repositoryRepository: Repository<RepoEntitiy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(EventBridgeService)
    private readonly eventBridgeService: EventBridgeService,
  ) {}

  findOne(id: number) {
    return this.repositoryRepository.findOne({ where: { id: id } });
  }

  async findOneByName({ repoName, githubId }: FindRepoParamDto) {
    const repo = await this.repositoryRepository.findOne({
      where: { name: repoName, user: { githubId } },
    });
    await repo.commits;
    return { ...repo };
  }

  findUsersRepositories(githubId: string) {
    return this.repositoryRepository.find({ where: { user: { githubId } } });
  }

  async findAllRepository(githubId: string, accessToken: string, page = 1) {
    const { getRepositories } = useGithubAPI({
      user: { githubId, access_token: accessToken },
    });

    const data = await getRepositories<RepositoryResponse[]>(page);

    const response: FindAllRepositoryResponse[] = [
      ...data.data.map(
        ({ description, html_url, name, full_name, private: isPrivate }) => ({
          description,
          html_url,
          name,
          full_name,
          isPrivate,
        }),
      ),
    ];

    if (data.data.length >= 100) {
      const res = await this.findAllRepository(githubId, accessToken, page + 1);
      response.concat(res);

      return response;
    }

    return response;
  }

  async createUserRepository(
    githubId: string,
    repository: CreateUserRepositoryDto,
  ) {
    const result = this.repositoryRepository.create();

    result.user = await this.userRepository.findOne({ where: { githubId } });
    result.description = repository.description;
    result.html_url = repository.html_url;
    result.name = repository.name;
    result.isPrivate = repository.isPrivate;

    // await this.eventBridgeService.register(result.user);

    return await this.repositoryRepository.save(result);
  }

  remove(id: number) {
    return `This action removes a #${id} repository`;
  }
}
