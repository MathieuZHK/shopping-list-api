import { IsNotEmpty, IsString } from 'class-validator';

export class ProductShoppingListDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
  @IsNotEmpty()
  @IsString()
  shoppingListId: string;
}
