import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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

  @Delete('deleteShoppingList')
  @HttpCode(HttpStatus.OK)
  deleteShoppingListById(
    @GetCurrentUserId() userId: string,
    @Param('shoppingListId') shoppingListId: string,
  ) {
    return this.shoppingListService.deleteShoppingListByIdAndUserId(
      userId,
      shoppingListId,
    );
  }

  @Put('updateShoppingList')
  @HttpCode(HttpStatus.OK)
  updateShoppingListById(
    @GetCurrentUserId() userId: string,
    @Body() dto: ShoppingListDto,
  ) {
    return this.shoppingListService.updateShoppingList(userId, dto);
  }

  @Get('getProductsOnShoopingListByShoppingId')
  @HttpCode(HttpStatus.FOUND)
  getProductsOnShoppingListByShoppingId(
    @GetCurrentUserId() userId: string,
    @Param('shoppingListId') shoppingListId: string,
  ) {
    return this.shoppingListService.getProductsListByShoppingListId(
      userId,
      shoppingListId,
    );
  }
}
