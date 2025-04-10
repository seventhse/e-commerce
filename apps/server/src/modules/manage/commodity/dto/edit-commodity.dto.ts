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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommodityImageDto {
  @ApiProperty({ description: '商品图片URL' })
  @IsString()
  image: string;

  @ApiPropertyOptional({ description: '排序顺序', default: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '图片替代文本' })
  @IsString()
  @IsOptional()
  alt?: string;
}

export class CreateCommodityDto {
  @ApiProperty({ description: '商品名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '商品描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '商品价格', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({ description: '商品库存', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  stock: number;

  @ApiPropertyOptional({ description: '商品主图片URL' })
  @IsString()
  @IsOptional()
  mainImage?: string;

  @ApiProperty({ description: '商品分类 ID' })
  @IsString()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ description: '是否激活', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '商品图片列表',
    type: [CommodityImageDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CommodityImageDto)
  images?: CommodityImageDto[];
}

export class UpdateCommodityDto extends PartialType(CreateCommodityDto) {
  @ApiProperty({ description: '商品ID' })
  @IsString()
  @IsUUID()
  id: string;
}
