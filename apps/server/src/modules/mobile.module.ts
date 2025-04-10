import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { DynamicModuleLoaderModule } from '~/common/plugins/dynamic-module-loader';
import { AuthService } from './manage/auth/auth.service';

@Module({
  imports: [
    DynamicModuleLoaderModule.registerAsync({
      basePath: resolve(__dirname, 'mobile'),
      autoLoad: true,
      recursive: true,
      parallel: true,
    }),
  ],
  providers: [AuthService],
})
export class MobileModule {}
