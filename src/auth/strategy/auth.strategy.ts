import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ValidatationErrorException } from 'src/core/filters/exception/service.exception';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: User) {
    const token = req.headers['authorization']?.split(' ')[1];
    const { isValidate, message, user } = await this.authService.tokenValidate({
      token,
      githubId: payload.githubId,
    });

    if (!isValidate) {
      throw ValidatationErrorException(message);
    }

    return { ...payload, token, user };
  }
}
