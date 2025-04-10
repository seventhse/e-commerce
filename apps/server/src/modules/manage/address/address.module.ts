import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { DynamicModule } from '~/common/plugins/dynamic-module-loader';

@DynamicModule({
  name: 'AddressManageModule',
  enabled: true,
  weight: 2,
})
@Module({
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
