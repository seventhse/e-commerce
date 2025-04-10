import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { LoggerService } from '~/common/logger/logger.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import {
  getErrorMessageForType,
  SignInDto,
  SignInType,
} from './dto/signIn.dto';
import { BusinessException } from '~/common/exceptions/business.exception';
import { argon2Verify } from '~/common/utils/argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async signIn(signInDto: SignInDto) {
    this.logger.debug(
      `尝试登录: ${signInDto.account} [类型: ${signInDto.type || 'username'}]`,
    );

    let where: Prisma.UserWhereUniqueInput = {
      username: '',
    };

    if (!signInDto.type || signInDto.type === SignInType.USERNAME) {
      where = { username: signInDto.account };
      this.logger.debug(`使用用户名登录: ${signInDto.account}`);
    } else if (signInDto.type === SignInType.EMAIL) {
      where = { email: signInDto.account };
      this.logger.debug(`使用邮箱登录: ${signInDto.account}`);
    } else if (signInDto.type === SignInType.PHONE) {
      where = { phone: signInDto.account };
      this.logger.debug(`使用手机号登录: ${signInDto.account}`);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        ...where,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!user) {
      this.logger.warn(
        `登录失败: 用户不存在 [账号: ${signInDto.account}, 类型: ${signInDto.type || 'username'}]`,
      );
      throw new BusinessException(400, getErrorMessageForType(signInDto.type));
    }

    if (!(await argon2Verify(user.password, signInDto.password))) {
      this.logger.warn(
        `登录失败: 密码不匹配 [账号: ${signInDto.account}, 用户ID: ${user.id}]`,
      );
      throw new BusinessException(400, '密码不匹配，请检查。');
    }

    if (!user.isActive) {
      this.logger.warn(
        `登录失败: 账号已冻结 [账号: ${signInDto.account}, 用户ID: ${user.id}]`,
      );
      throw new BusinessException(403, '您的账号已冻结，请联系管理员.');
    }

    const payload = {
      sub: user.id,
      type: signInDto.type || SignInType.USERNAME,
    };

    const refreshPayload = {
      sub: user.id,
      type: signInDto.type || SignInType.USERNAME,
      refresh: true,
    };

    this.logger.log(
      `用户登录成功 [账号: ${signInDto.account}, 用户ID: ${user.id}]`,
    );

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRE || '1h',
      }),
      refresh_token: await this.jwtService.signAsync(refreshPayload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '1d',
      }),
    };
  }

  logout() {
    // TODO: logout add redis storage token
    this.logger.log('用户登出处理');
  }

  async getUserInfo(id: string) {
    this.logger.debug(`获取用户信息 [用户ID: ${id}]`);

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      omit: {
        password: true,
        isActive: true,
        deletedAt: true,
      },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      this.logger.warn(
        `获取用户信息失败: 用户不存在或状态异常 [用户ID: ${id}]`,
      );
      throw new BusinessException(403, '用户状态发生变化，请联系管理员.');
    }

    this.logger.debug(
      `用户信息获取成功 [用户ID: ${id}, 角色数: ${user.userRoles.length}]`,
    );

    const { userRoles, ...userInfo } = user;

    return {
      ...userInfo,
      roles: userRoles.map((item) => item.role),
    };
  }

  async refreshToken(payload: AuthPayload) {
    this.logger.debug(`刷新令牌 [用户ID: ${payload.sub}]`);

    const newPayload: AuthPayload = {
      sub: payload.sub,
      type: payload.type,
    };

    const token = await this.jwtService.signAsync(newPayload, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    this.logger.debug(`令牌刷新成功 [用户ID: ${payload.sub}]`);
    return token;
  }
}
