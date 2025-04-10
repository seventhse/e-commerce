import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerDto } from './create-consumer.dto';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConsumerDto extends PartialType(CreateConsumerDto) {
  @ApiProperty({ description: '客户ID' })
  @IsString()
  @IsUUID()
  id: string;
}
