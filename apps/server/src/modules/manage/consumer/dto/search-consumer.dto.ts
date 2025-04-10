import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchConsumerDto {
  @ApiPropertyOptional({ description: '手机号码' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;
}

export class PageConsumerDto extends SearchConsumerDto {
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
}
