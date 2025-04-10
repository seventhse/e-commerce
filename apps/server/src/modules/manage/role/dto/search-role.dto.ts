import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { isActive } from '~/common/utils/utils';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';

export class SearchRoleDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => isActive(value))
  isActive?: boolean;
}

export class PageRoleDto extends IntersectionType(SearchRoleDto, PageDto) {}
