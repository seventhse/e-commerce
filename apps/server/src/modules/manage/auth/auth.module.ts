import { Module } from '@nestjs/common';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@DynamicModule({
  name: 'ManageAuthModule',
  enabled: true,
  weight: 1,
})
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
