import { PartialType } from '@nestjs/mapped-types';
import { CreateDistributionDto } from './create-distribution.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateDistributionDto extends PartialType(CreateDistributionDto) {
  @IsString()
  @IsUUID()
  id: string;
}
