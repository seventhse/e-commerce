import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RolePermissionDto {
  @ApiProperty({ description: '角色ID' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ description: '权限ID列表', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  permissionIds: string[];
}
