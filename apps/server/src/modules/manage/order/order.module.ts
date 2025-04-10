import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';

@DynamicModule({
  name: 'OrderManageModule',
  enabled: true,
  weight: 6,
})
@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
