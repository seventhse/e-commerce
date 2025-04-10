import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';
import { transformBoolean } from '~/common/utils/utils';

export class SearchCommodityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  maxPrice?: number;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class PageCommodityDto extends IntersectionType(
  SearchCommodityDto,
  PageDto,
) {}
