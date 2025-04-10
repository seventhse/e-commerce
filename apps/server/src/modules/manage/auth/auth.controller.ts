import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from '~/common/decorator/auth.decorator';

@ApiTags('认证管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  @Public()
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({ status: 200, description: '登出成功' })
  @Get('signOut')
  signOut() {
    this.authService.logout();
    return null;
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '成功获取用户信息' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Get('getUserInfo')
  getUserInfo(@Req() req: AuthRequest) {
    return this.authService.getUserInfo(req.user.sub);
  }

  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponse({ status: 200, description: '成功刷新令牌' })
  @ApiResponse({ status: 401, description: '令牌已过期或无效' })
  @Get('refreshToken')
  refreshToken(@Req() req: AuthRequest) {
    return this.authService.refreshToken(req.user);
  }
}
