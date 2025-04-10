import {
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  realName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {
  @IsString()
  @IsUUID()
  id: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  password: string;
}
