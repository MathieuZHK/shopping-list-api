import { IsNotEmpty, IsString } from 'class-validator';
import { ProductDto } from './product.dto';

export class ProductShoppingListDto {
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  shoppingListId: string;
  @IsNotEmpty()
  product: ProductDto;
}
