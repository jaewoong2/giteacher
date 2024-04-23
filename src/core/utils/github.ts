import axios from 'axios';
import { GithubUser } from 'src/auth/auth.service';
import { Commit } from 'src/commits/entities/commit.entity';
import { Repository } from 'src/repositories/entities/repository.entity';
import { User } from 'src/users/entities/user.entity';

const BASE_API_GITHUB_URL = 'https://api.github.com';

type UseGitHubAPI = {
  user?: Partial<User & GithubUser>;
  repository?: Partial<Repository>;
  commit?: Partial<Commit>;
};

const useGithubAPI = ({ user, repository, commit }: UseGitHubAPI) => {
  const API_GITHUB_GET_COMMIT_URL = `${BASE_API_GITHUB_URL}/repos/${user.githubId}/${repository?.name}/commits`;
  const API_GITHUB_GET_DETAIL_DIFF_COMMITS_URL = `${BASE_API_GITHUB_URL}/repos/${user.githubId}/${repository?.name}/commits/${commit?.sha}`;
  const API_GITHUB_GET_REPOSITORIES_URL = `${BASE_API_GITHUB_URL}/users/${user.githubId}/repos`;

  return {
    getCommits: async <T>(page: number = 1, since?: string) => {
      const SINCE = since ? `&since=${since}` : '';
      const response = await axios.get<T>(
        `${API_GITHUB_GET_COMMIT_URL}?page=${page}${SINCE}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        },
      );

      return response;
    },
    getRepositories: async <T>(page: number = 1) => {
      const response = await axios.get<T>(
        `${API_GITHUB_GET_REPOSITORIES_URL}?page=${page}`,
        {
          headers: { Authorization: `Bearer ${user.access_token}` },
        },
      );

      return response;
    },
    getCommitDiff: async <T>() => {
      const response = await axios.get<T>(
        API_GITHUB_GET_DETAIL_DIFF_COMMITS_URL,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            accept: 'application/vnd.github.VERSION.diff',
          },
        },
      );

      return response;
    },
  };
};

export { useGithubAPI, UseGitHubAPI };
