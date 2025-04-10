import { Module } from '@nestjs/common';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@DynamicModule({
  name: 'RoleManageModule',
  description: 'Role management module',
  enabled: true,
  weight: 3,
})
@Module({
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
