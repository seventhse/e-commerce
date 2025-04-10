import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { transformBoolean } from '~/common/utils/utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommodityCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '分类描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '是否在前台展示', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isDisplayed?: boolean;

  @ApiPropertyOptional({ description: '是否激活', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class UpdateCommodityCategoryDto extends PartialType(
  CreateCommodityCategoryDto,
) {
  @ApiProperty({ description: '分类ID' })
  @IsString()
  @IsUUID()
  id: string;
}
