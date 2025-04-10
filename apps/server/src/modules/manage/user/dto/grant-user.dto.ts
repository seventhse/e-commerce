import {
  IsArray,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GrantUserDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '角色ID列表', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  roleIds: string[];
}

export class RevokeUserDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '角色ID列表', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  roleIds: string[];
}
