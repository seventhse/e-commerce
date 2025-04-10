import {
  IsArray,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';

export class GrantUserDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  roleIds: string[];
}

export class RevokeUserDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  roleIds: string[];
}
