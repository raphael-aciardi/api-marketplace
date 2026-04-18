import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateSellerDto {
  @IsString()
  @IsNotEmpty()
  bankDetails: string;

  @IsString()
  @IsNotEmpty()
  billingAddress: string;
}
