import { IsNotEmpty, IsString } from 'class-validator';
import { ProductDto } from 'src/product/dto/product.dto';

export class ShoppingListDto {
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  userId: string;
  @IsNotEmpty()
  @IsString()
  owner: string;
  productList: ProductDto[];
}
