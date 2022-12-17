import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  barcode: number;
  @IsNumber()
  qty: number;
  @IsNumber()
  price: number;
}
