import { Inject, Injectable } from '@nestjs/common';
import { GithubAuthDto } from './dto/github-auth.dto';
import { authConfig } from 'src/core/config/auth.config';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { ServiceException } from 'src/core/filters/exception/service.exception';
import { AUTHORIZATION_ERROR } from 'src/core/filters/exception/error-code';
import { UsersService } from 'src/users/users.service';

export type GithubUser = {
  githubId: string;
  avatar: string;
  name: string;
  description: string;
  location: string;
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  async tokenValidate({
    githubId,
    token,
  }: {
    githubId: string;
    token: string;
  }) {
    if (!githubId) {
      return {
        isValidate: false,
        message: '깃헙 아이디가 정의되지 않았습니다.',
      };
    }

    const user = await this.usersService.findOneUser(githubId);

    if (!user) {
      return {
        isValidate: false,
        message: '잘못된 Email 정보 입니다',
      };
    }

    if (token !== user.accessToken) {
      return {
        isValidate: false,
        message: '잘못된 JWT Token 입니다. 다시 로그인 해주세요',
      };
    }

    return { isValidate: true, message: '올바른 JWT Token 입니다.', user };
  }

  public getGithubLoginUrl(query: string = '') {
    const LOGIN_REDIRECT_URL = `${this.config.auth.github.login_redirect_url}${query}`;
    const CLIENT_ID = this.config.auth.github.client_id;

    return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${LOGIN_REDIRECT_URL}`;
  }

  public async getGithubInfo(
    githubCodeDto: GithubAuthDto,
  ): Promise<GithubUser & { access_token: string }> {
    const { code } = githubCodeDto;
    // 웹에서 query string으로 받은 code를 서버로 넘겨 받습니다.

    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';
    // 깃허브 access token을 얻기위한 요청 API 주소

    const request = {
      code,
      client_id: this.config.auth.github.client_id,
      client_secret: this.config.auth.github.client_secret,
    };
    // Body에는 Client ID, Client Secret, 웹에서 query string으로 받은 code를 넣어서 전달해주어야 합니다.

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json', // json으로 반환을 요청합니다.
      },
    });

    if (response.data.error) {
      // 에러 발생시
      throw new ServiceException(
        AUTHORIZATION_ERROR,
        '깃허브 인증을 실패했습니다.',
      );
    }

    const { access_token } = response.data;
    // 요청이 성공한다면, access_token 키값의 토큰을 깃허브에서 넘겨줍니다.

    const getUserUrl: string = 'https://api.github.com/user';
    // 깃허브 유저 조회 API 주소

    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
      // 헤더에는 `token ${access_token} 형식으로 넣어주어야 합니다.`
    });

    const { login, avatar_url, name, bio, company } = data;
    // 깃허브 유저 조회 API에서 받은 데이터들을 골라서 처리해줍니다.

    const githubInfo: GithubUser = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company,
      access_token,
    };

    return { ...githubInfo };
  }
}
