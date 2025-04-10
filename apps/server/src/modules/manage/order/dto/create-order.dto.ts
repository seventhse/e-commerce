import { OrderStatus, PaymentMethod } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsDecimal,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @IsNotEmpty()
  @IsUUID()
  consumerId: string;

  @IsNotEmpty()
  @IsUUID()
  addressId: string;

  @IsNotEmpty()
  @IsDecimal()
  totalPrice: Decimal;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
