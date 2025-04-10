import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class PageOrderDto {
  @Type(() => Number)
  @IsInt()
  page: number;

  @Type(() => Number)
  @IsInt()
  pageSize: number;

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
  status?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class SearchOrderDto extends PageOrderDto {
  // You can add more specific search criteria here if needed,
  // for example, date range, total price range, etc.

  // Example: Search by OrderItem's commodityId
  @IsOptional()
  @IsString()
  commodityId?: string; 
}