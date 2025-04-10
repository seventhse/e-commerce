import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';

@DynamicModule({
  name: 'CartItemManageModule',
  enabled: true,
  weight: 6,
})
@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
