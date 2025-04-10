import { IntersectionType } from '@nestjs/mapped-types';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { PageDto } from '~/common/dto/common.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchOrderDto {
  @ApiPropertyOptional({ description: '订单编号' })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiPropertyOptional({ description: '客户ID' })
  @IsOptional()
  @IsString()
  consumerId?: string;

  @ApiPropertyOptional({ description: '收货地址ID' })
  @IsOptional()
  @IsString()
  addressId?: string;

  @ApiPropertyOptional({ description: '订单状态', enum: OrderStatus })
  @IsOptional()
  @IsString()
  status?: OrderStatus;

  @ApiPropertyOptional({ description: '支付方式', enum: PaymentMethod })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  // You can add more specific search criteria here if needed,
  // for example, date range, total price range, etc.

  // Example: Search by OrderItem's commodityId
  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsString()
  commodityId?: string;
}

export class PageOrderDto extends IntersectionType(SearchOrderDto, PageDto) {}
