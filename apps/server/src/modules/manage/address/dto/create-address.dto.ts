import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: '客户ID' })
  @IsString()
  @IsNotEmpty()
  consumerId: string;

  @ApiProperty({ description: '省份' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ description: '城市' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: '区/县' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: '详细地址' })
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiPropertyOptional({ description: '是否默认地址', default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
