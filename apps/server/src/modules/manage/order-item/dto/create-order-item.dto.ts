// Temporarily commenting out the swagger import
// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDecimal } from 'class-validator';

export class CreateOrderItemDto {
  // @ApiProperty({ description: '订单ID' })
  @IsNotEmpty({ message: '订单ID不能为空' })
  @IsString({ message: '订单ID必须是字符串' })
  orderId: string;

  // @ApiProperty({ description: '商品ID' })
  @IsNotEmpty({ message: '商品ID不能为空' })
  @IsString({ message: '商品ID必须是字符串' })
  commodityId: string;

  // @ApiProperty({ description: '商品数量' })
  @IsNotEmpty({ message: '商品数量不能为空' })
  @IsInt({ message: '商品数量必须是整数' })
  quantity: number;

  // @ApiProperty({ description: '商品价格' })
  @IsNotEmpty({ message: '商品价格不能为空' })
  @IsDecimal({ decimal_digits: '0,2' }, { message: '商品价格必须是数字' })
  price: any;
}
