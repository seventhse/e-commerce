import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageDto {
  @ApiPropertyOptional({ description: '页码', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => (value ? Number(value) || 1 : 1))
  page: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => (value ? Number(value) || 10 : 10))
  pageSize: number = 10;
}
