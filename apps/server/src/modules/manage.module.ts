import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { DynamicModuleLoaderModule } from '~/common/plugins/dynamic-module-loader';

@Module({
  imports: [
    DynamicModuleLoaderModule.registerAsync({
      basePath: resolve(__dirname, 'manage'),
      autoLoad: true,
      recursive: true,
      parallel: true,
    }),
  ],
  controllers: [],
})
export class ManageModule {}
