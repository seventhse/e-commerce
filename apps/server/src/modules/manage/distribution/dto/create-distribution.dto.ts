import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDistributionDto {
  @IsNotEmpty()
  @IsString()
  salesId: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;
}