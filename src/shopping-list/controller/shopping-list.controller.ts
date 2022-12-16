import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ShoppingList, ShoppingListOnUsers } from '@prisma/client';
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
  ): Promise<ShoppingListOnUsers> {
    return this.shoppingListService.createShoppingList(userId, dto);
  }

  @Get('getShoppingListByUserId')
  @HttpCode(HttpStatus.OK)
  getShoppingListByUserId(
    @GetCurrentUserId() userId: string,
  ): Promise<ShoppingList[]> {
    return this.shoppingListService.getShoppingListByUserId(userId);
  }

  // DELETE ShoppingList
  // UPDATE ShoppingList
  // GET Products on shopping list by shoppingListID
}
