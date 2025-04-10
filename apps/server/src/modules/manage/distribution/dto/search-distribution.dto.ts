import { IntersectionType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PageDto } from '~/common/dto/common.dto';

export class SearchDistributionDto {
  @IsOptional()
  @IsString()
  salesId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;
}

export class PageDistributionDto extends IntersectionType(
  SearchDistributionDto,
  PageDto,
) {}
