import { Module } from '@nestjs/common';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';
import { CommodityController } from './commodity.controller';
import { CommodityService } from './commodity.service';

@DynamicModule({
  name: 'CommodityManageModule',
  description: 'Commodity management module',
  enabled: true,
  weight: 5,
})
@Module({
  controllers: [CommodityController],
  providers: [CommodityService],
})
export class CommodityModule {}
