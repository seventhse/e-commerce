import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty({ description: '客户ID' })
  @IsString()
  consumerId: string;

  @ApiProperty({ description: '商品ID' })
  @IsString()
  commodityId: string;

  @ApiProperty({ description: '商品数量', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
