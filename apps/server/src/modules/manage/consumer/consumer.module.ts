import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';

@DynamicModule({
  name: 'ConsumerManageModule',
  enabled: true,
  weight: 3,
})
@Module({
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {

}