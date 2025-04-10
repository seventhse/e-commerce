import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';
import { Transform } from 'class-transformer';
import { isActive } from '~/common/utils/utils';

export class SearchCommodityCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => isActive(value))
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => isActive(value))
  isDisplayed?: boolean;
}

export class PageCommodityCategoryDto extends IntersectionType(
  SearchCommodityCategoryDto,
  PageDto,
) {}
