import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from '~/common/decorator/auth.decorator';

@Controller('/v1/manage/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('signOut')
  signOut() {
    this.authService.logout();
    return null;
  }

  @Get('getUserInfo')
  getUserInfo(@Req() req: AuthRequest) {
    return this.authService.getUserInfo(req.user.sub);
  }

  @Get('refreshToken')
  refreshToken(@Req() req: AuthRequest) {
    return this.authService.refreshToken(req.user);
  }
}
