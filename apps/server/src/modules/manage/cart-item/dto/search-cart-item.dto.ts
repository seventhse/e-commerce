import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PageCartItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;

  @IsOptional()
  @IsString()
  consumerId?: string;

  @IsOptional()
  @IsString()
  commodityId?: string;
}

export class SearchCartItemDto {
  @IsOptional()
  @IsString()
  consumerId?: string;

  @IsOptional()
  @IsString()
  commodityId?: string;
}
