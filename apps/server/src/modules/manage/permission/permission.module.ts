import { Module } from '@nestjs/common';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@DynamicModule({
  name: 'PermissionManageModule',
  description: 'Permission management module',
  enabled: true,
  weight: 3,
})
@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
