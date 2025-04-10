import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PageDistributionDto {
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
  salesId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;
}

export class SearchDistributionDto extends PageDistributionDto {
  @IsOptional()
  @IsString()
  salesName?: string;

  @IsOptional()
  @IsString()
  customerName?: string;
}