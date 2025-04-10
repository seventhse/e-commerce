import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { isActive } from '~/common/utils/utils';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchRoleDto {
  @ApiPropertyOptional({ description: '角色名称', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  name?: string;

  @ApiPropertyOptional({ description: '角色描述', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: '是否激活' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => isActive(value))
  isActive?: boolean;
}

export class PageRoleDto extends IntersectionType(SearchRoleDto, PageDto) {}
