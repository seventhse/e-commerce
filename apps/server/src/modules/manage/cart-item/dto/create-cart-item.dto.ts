import { IsString, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  consumerId: string;

  @IsString()
  commodityId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
