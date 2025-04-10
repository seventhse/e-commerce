import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchConsumerDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class PageConsumerDto extends SearchConsumerDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;
}
