import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { transformBoolean } from '~/common/utils/utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: '权限名称', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '权限编码', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiPropertyOptional({ description: '权限描述', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: '是否激活', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({ description: '权限ID' })
  @IsString()
  @IsUUID()
  id: string;
}
