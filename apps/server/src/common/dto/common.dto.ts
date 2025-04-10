import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PageDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => (value ? Number(value) || 1 : 1))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => (value ? Number(value) || 10 : 10))
  pageSize: number = 10;
}
