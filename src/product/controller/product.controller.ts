import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { ProductDto } from '../dto/product.dto';
import { ProductShoppingListDto } from '../dto/productShoppingList.dto';
import { ProductService } from '../service/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: ProductDto) {
    return this.productService.createProduct(dto);
  }

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

  @Delete('productOnShoppingList')
  @HttpCode(HttpStatus.OK)
  deleteProductOnShoppingList(
    @GetCurrentUserId() userId: string,
    @Body() dto: ProductShoppingListDto,
  ) {
    return this.productService.deleteProductOnShoppingList(userId, dto);
  }
}
