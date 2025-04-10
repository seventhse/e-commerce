import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { Reflector } from '@nestjs/core';
import { IS_PRIVATE_KEY, IS_PUBLIC_KEY } from '../decorator/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    if (request.url.includes('mobile')) {
      const isPrivate = this.reflector.getAllAndOverride<boolean>(
        IS_PRIVATE_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!isPrivate) {
        return true;
      }
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.refresh && !request.url.includes('refreshToken')) {
        throw new BusinessException(4004, 'Refresh your token.');
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
