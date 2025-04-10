import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PageAddressDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  consumerId?: string;
}

export class SearchAddressDto {
  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  consumerId?: string;
}
