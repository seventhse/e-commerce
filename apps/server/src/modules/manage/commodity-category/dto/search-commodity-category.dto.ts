import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';
import { Transform } from 'class-transformer';
import { isActive } from '~/common/utils/utils';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchCommodityCategoryDto {
  @ApiPropertyOptional({ description: '分类名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '分类描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '是否激活' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => isActive(value))
  isActive?: boolean;

  @ApiPropertyOptional({ description: '是否在前台展示' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => isActive(value))
  isDisplayed?: boolean;
}

export class PageCommodityCategoryDto extends IntersectionType(
  SearchCommodityCategoryDto,
  PageDto,
) {}
