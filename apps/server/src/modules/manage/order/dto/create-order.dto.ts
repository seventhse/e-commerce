import { OrderStatus, PaymentMethod } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsDecimal,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: '订单编号' })
  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @ApiProperty({ description: '客户ID' })
  @IsNotEmpty()
  @IsUUID()
  consumerId: string;

  @ApiProperty({ description: '收货地址ID' })
  @IsNotEmpty()
  @IsUUID()
  addressId: string;

  @ApiProperty({ description: '订单总价' })
  @IsNotEmpty()
  @IsDecimal()
  totalPrice: Decimal;

  @ApiProperty({ description: '订单状态', enum: OrderStatus })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ description: '支付方式', enum: PaymentMethod })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
