import { IntersectionType } from '@nestjs/mapped-types';
import { OrderStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { PageDto } from '~/common/dto/common.dto';

export class SearchOrderDto {
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsString()
  consumerId?: string;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @IsString()
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  // You can add more specific search criteria here if needed,
  // for example, date range, total price range, etc.

  // Example: Search by OrderItem's commodityId
  @IsOptional()
  @IsString()
  commodityId?: string;
}

export class PageOrderDto extends IntersectionType(SearchOrderDto, PageDto) {}
