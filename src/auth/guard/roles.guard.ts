import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredLevels = this.reflector.get<string[]>(
      'levels',
      context.getHandler(),
    );

    if (!requiredLevels) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request.user; // 가정: 요청에 사용자 정보가 이미 있음 (예: AuthGuard를 통해)

    if (!user) {
      throw new UnauthorizedException();
    }

    const hasPermission = requiredLevels.some((level) => user.level === level);
    if (!hasPermission) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
