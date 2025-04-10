import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';
import { transformBoolean } from '~/common/utils/utils';

export class SearchPermissionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class PagePermissionDto extends IntersectionType(
  SearchPermissionDto,
  PageDto,
) {}
