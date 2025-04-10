import { Module } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { DistributionController } from './distribution.controller';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';

@DynamicModule({
  name: 'DistributionManageModule',
  enabled: true,
  weight: 10,
})
@Module({
  controllers: [DistributionController],
  providers: [DistributionService],
})
export class DistributionModule {}
