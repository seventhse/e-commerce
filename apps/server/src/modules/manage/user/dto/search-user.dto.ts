import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { isActive } from '~/common/utils/utils';
import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '~/common/dto/common.dto';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  realName?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => isActive(value))
  isActive?: boolean;
}

export class PageUserDto extends IntersectionType(SearchUserDto, PageDto) {}
