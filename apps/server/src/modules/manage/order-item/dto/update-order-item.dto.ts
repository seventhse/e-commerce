import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @IsString()
  @IsUUID()
  id: string;
}
