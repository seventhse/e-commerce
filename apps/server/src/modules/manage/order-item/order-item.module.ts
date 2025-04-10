import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';

@DynamicModule({
  name: 'OrderItemManageModule',
  enabled: true,
  weight: 8,
})

@Module({ 
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {

}