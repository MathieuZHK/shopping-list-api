import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ShoppingListToShareDto {
  @IsNotEmpty()
  @IsEmail()
  userEmailToShare: string;
  @IsNotEmpty()
  @IsString()
  shoppingListId: string;
}
