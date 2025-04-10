import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsumerDto {
  @ApiProperty({ description: '手机号码' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: '头像 URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '密码' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: '身份证正面照片 URL' })
  @IsOptional()
  @IsString()
  frontCard?: string;

  @ApiPropertyOptional({ description: '身份证反面照片 URL' })
  @IsOptional()
  @IsString()
  backCard?: string;

  @ApiPropertyOptional({ description: '手持身份证照片 URL' })
  @IsOptional()
  @IsString()
  userCard?: string;
}
