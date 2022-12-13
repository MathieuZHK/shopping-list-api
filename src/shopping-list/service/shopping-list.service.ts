import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShoppingList } from '@prisma/client';
import { ProductService } from 'src/product/service/product.service';
import { ShoppingListDto } from '../dto/shopping-list.dto';
import { ShoppingListRepository } from '../repository/shopping-list.repository';

@Injectable()
export class ShoppingListService {
  constructor(
    private repository: ShoppingListRepository,
    private productService: ProductService,
  ) {}

  async createShoppingList(userId: string, data: ShoppingListDto) {
    if (!data)
      throw new HttpException(
        { message: 'No data on body request', Error },
        HttpStatus.BAD_REQUEST,
      );
    if (data.userId !== userId)
      throw new HttpException(
        {
          message: 'Wrong User, Connected User cannot create for another one',
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );

    const responseCreatedShoppingList =
      await this.repository.createShoppingList(
        this.convertShoppingListDtoToShoppingListEntity(data),
      );

    if (data.productList && data.productList.length > 0) {
      data.productList.forEach(async (product) => {
        const responseProduct = await this.productService.createProduct(
          product,
        );
        if (!responseProduct) throw new Error('Product creation error');

        const responseProductOnShoppingList =
          await this.productService.createProductOnShoppingList(
            responseProduct.id,
            responseCreatedShoppingList.id,
          );

        if (!responseProductOnShoppingList)
          throw Error('Product on shoppingList error');
      });
    }

    const responseCreatedShoppingListOnUser =
      await this.createShoppingListOnUser(
        userId,
        responseCreatedShoppingList.id,
        true,
      );

    return responseCreatedShoppingListOnUser;
  }

  async createShoppingListOnUser(
    userId: string,
    shoppingListId: string,
    owner: boolean,
  ) {
    if (!userId) {
      throw new HttpException(
        { message: 'No data found or wrong userId', Error },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!shoppingListId)
      throw new HttpException(
        { message: 'No data found or wrong shoppingListId', Error },
        HttpStatus.BAD_REQUEST,
      );
    if (owner === null || owner === undefined)
      throw new HttpException(
        { message: 'No data found or empty owner', Error },
        HttpStatus.BAD_REQUEST,
      );
    return await this.repository.createShoppingListOnUser(
      userId,
      shoppingListId,
      owner,
    );
  }

  convertShoppingListDtoToShoppingListEntity(
    data: ShoppingListDto,
  ): ShoppingList {
    const shoppingListEntity: ShoppingList = {
      id: null,
      name: data.name,
      createdAt: new Date(),
    };
    return shoppingListEntity;
  }
}
