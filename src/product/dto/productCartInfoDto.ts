import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ProductCartInfoDto {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsBoolean()
  inCart: boolean;
}
