import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';
import { transformBoolean } from '~/common/utils/utils';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchCommodityDto {
  @ApiPropertyOptional({ description: '商品名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '商品描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '最低价格', default: 0 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  minPrice?: number;

  @ApiPropertyOptional({ description: '最高价格' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  maxPrice?: number;

  @ApiPropertyOptional({ description: '商品分类 ID' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: '是否激活' })
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class PageCommodityDto extends IntersectionType(
  SearchCommodityDto,
  PageDto,
) {}
