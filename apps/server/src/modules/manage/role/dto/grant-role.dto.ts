import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class RolePermissionDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @ArrayNotEmpty()
  permissionIds: string[];
}
