import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart-item.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @IsString()
  @IsUUID()
  id: string;
}
