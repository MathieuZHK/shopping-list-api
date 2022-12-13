import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { ShoppingListDto } from '../dto/shopping-list.dto';
import { ShoppingListService } from '../service/shopping-list.service';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private shoppingListService: ShoppingListService) {}

  @Post('createShoppingListOnUser')
  @HttpCode(HttpStatus.CREATED)
  createShoppingListOnConnectedUser(
    @Body() dto: ShoppingListDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.shoppingListService.createShoppingList(userId, dto);
  }
}
