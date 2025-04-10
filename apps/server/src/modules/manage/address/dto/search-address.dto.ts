import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageAddressDto {
  @ApiProperty({ description: '页码', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ description: '每页数量', default: 10, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;

  @ApiPropertyOptional({ description: '省份' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: '城市' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: '区/县' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: '详细地址' })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional({ description: '是否默认地址' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: '客户ID' })
  @IsOptional()
  @IsString()
  consumerId?: string;
}

export class SearchAddressDto {
  @ApiPropertyOptional({ description: '省份' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: '城市' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: '区/县' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: '详细地址' })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional({ description: '是否默认地址' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: '客户ID' })
  @IsOptional()
  @IsString()
  consumerId?: string;
}
