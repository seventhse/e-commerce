import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';

@DynamicModule({
  name: 'UserManageModule',
  enabled: true,
  weight: 2,
})
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
