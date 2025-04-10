import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart-item.dto';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @ApiProperty({ description: '购物车项ID' })
  @IsString()
  @IsUUID()
  id: string;
}
