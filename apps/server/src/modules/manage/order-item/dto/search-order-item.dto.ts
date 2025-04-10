import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageOrderItemDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize: number;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  commodityId?: string;
}

export class SearchOrderItemDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  commodityId?: string;

  // Add more searchable attributes as needed, e.g.:
  // @IsOptional()
  // @IsInt()
  // @Type(() => Number)
  // quantity?: number;

  // Example of searching within related entities:
  // @IsOptional()
  // @IsString()
  // orderNumber?: string; // Search by Order's orderNumber

  // @IsOptional()
  // @IsString()
  // commodityName?: string; // Search by Commodity's name
}
