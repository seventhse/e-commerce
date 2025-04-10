import { Module } from '@nestjs/common';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';
import { CommodityCategoryController } from './commodity-category.controller';
import { CommodityCategoryService } from './commodity-category.service';

@DynamicModule({
  name: 'CommodityCategoryManageModule',
  description: 'Commodity category management module',
  enabled: true,
  weight: 4,
})
@Module({
  controllers: [CommodityCategoryController],
  providers: [CommodityCategoryService],
})
export class CommodityCategoryModule {}
