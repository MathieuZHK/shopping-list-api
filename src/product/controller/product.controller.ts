import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { ProductCartInfoDto } from '../dto/productCartInfoDto';
import { ProductShoppingListDto } from '../dto/productShoppingList.dto';
import { ProductService } from '../service/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('productOnShoppingList')
  @HttpCode(HttpStatus.CREATED)
  createProductOnShoppingList(
    @Body() dto: ProductShoppingListDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.productService.addProductOnShoppingList(userId, dto);
  }

  @Put('productOnShoppingList')
  @HttpCode(HttpStatus.OK)
  updateProductOnShoppingList(
    @Body() dto: ProductShoppingListDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.productService.updateProductOnShoppingList(userId, dto);
  }

  @Put('productOnShoppingListInCart')
  @HttpCode(HttpStatus.OK)
  updateProductOnShoppingListInCart(
    @Body() dto: ProductCartInfoDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.productService.updateProductOnShoppingListInCart(userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteProductOnShoppingList(
    @GetCurrentUserId() userId: string,
    @Param('id') productOnShoppingListId: string,
  ) {
    return this.productService.deleteProductOnShoppingList(
      userId,
      productOnShoppingListId,
    );
  }
}
