import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerDto } from './create-consumer.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateConsumerDto extends PartialType(CreateConsumerDto) {
  @IsString()
  @IsUUID()
  id: string;
}
