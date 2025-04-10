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

export class CreatePermissionDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(100)
  code: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsString()
  @IsUUID()
  id: string;
}
