import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';
import { transformBoolean } from '~/common/utils/utils';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPermissionDto {
  @ApiPropertyOptional({ description: '权限名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '权限编码' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '权限描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '是否激活' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class PagePermissionDto extends IntersectionType(
  SearchPermissionDto,
  PageDto,
) {}
