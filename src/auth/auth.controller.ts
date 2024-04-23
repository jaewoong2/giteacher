import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubAuthDto } from './dto/github-auth.dto';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guard/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/health')
  @UseGuards(JwtAuthGuard)
  async healthCheck(@Req() { user }: { user: User }) {
    console.log('Hello World');

    return user;
  }

  @Get('/github/login')
  async login(
    @Res() res: Response,
    @Query('redirectUrl') redirectUrl: string,
    @Query('currentUrl') currentUrl: string,
  ) {
    const url = this.authService.getGithubLoginUrl(
      `?redirectUrl=${redirectUrl}?currentUrl=${currentUrl}`,
    );

    res.redirect(url);

    return {
      url,
      statusCode: 301,
    };
  }

  @Get('/github/callback')
  public async getGithubInfo(
    @Res() res: Response,
    @Query() githubCodeDto: GithubAuthDto,
  ) {
    const { code, redirectUrl } = githubCodeDto;

    const user = await this.authService.getGithubInfo({ code });
    const accessToken = this.jwtService.sign(user);
    await this.usersService.createUser({ ...user, accessToken });

    const url = new URL(redirectUrl);
    const search = url.searchParams;
    const currentUrl = search.get('currentUrl');
    const redirect = `${url.origin}${url.pathname}?access_token=${accessToken}&redirect_url=${currentUrl}`;

    res.redirect(redirect);

    return {
      url: `redirect`,
      statusCode: 301,
    };
  }
}
