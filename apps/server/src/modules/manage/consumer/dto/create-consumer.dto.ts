import { IsString, IsOptional } from 'class-validator';

export class CreateConsumerDto {
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  frontCard?: string;

  @IsOptional()
  @IsString()
  backCard?: string;

  @IsOptional()
  @IsString()
  userCard?: string;
}