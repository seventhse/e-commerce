import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageCartItemDto {
  @ApiProperty({ description: '页码', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ description: '每页数量', default: 10, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;

  @ApiPropertyOptional({ description: '客户ID' })
  @IsOptional()
  @IsString()
  consumerId?: string;

  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsString()
  commodityId?: string;
}

export class SearchCartItemDto {
  @ApiPropertyOptional({ description: '客户ID' })
  @IsOptional()
  @IsString()
  consumerId?: string;

  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsString()
  commodityId?: string;
}
