import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @IsString()
  @IsUUID()
  id: string;
}
