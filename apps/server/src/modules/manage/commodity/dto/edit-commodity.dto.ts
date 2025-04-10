import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { transformBoolean } from '~/common/utils/utils';
import { Type } from 'class-transformer';

export class CommodityImageDto {
  @IsString()
  image: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsString()
  @IsOptional()
  alt?: string;
}

export class CreateCommodityDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  stock: number;

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsString()
  @IsUUID()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CommodityImageDto)
  images?: CommodityImageDto[];
}

export class UpdateCommodityDto extends PartialType(CreateCommodityDto) {
  @IsString()
  @IsUUID()
  id: string;
}
