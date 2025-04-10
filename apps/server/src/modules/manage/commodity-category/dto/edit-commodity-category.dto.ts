import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { transformBoolean } from '~/common/utils/utils';

export class CreateCommodityCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isDisplayed?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;
}

export class UpdateCommodityCategoryDto extends PartialType(
  CreateCommodityCategoryDto,
) {
  @IsString()
  @IsUUID()
  id: string;
}
