import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ProductOnShoppingLists, ShoppingList } from '@prisma/client';
import { ProductService } from 'src/product/service/product.service';
import { ShoppingListDto } from '../dto/shopping-list.dto';
import { ShoppingListRepository } from '../repository/shopping-list.repository';

@Injectable()
export class ShoppingListService {
  constructor(
    private repository: ShoppingListRepository,
    @Inject(forwardRef(() => ProductService))
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

        const productOnShoppingListEntity: ProductOnShoppingLists = {
          id: null,
          productId: responseProduct.id,
          shoppingListId: responseCreatedShoppingList.id,
          price: product.price,
          qty: product.qty,
        };

        const responseProductOnShoppingList =
          await this.productService.createProductOnShoppingList(
            productOnShoppingListEntity,
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

  async updateShoppingList(userId: string, data: ShoppingListDto) {
    const responseIfUserIdExistForShoppingList =
      await this.getUserIdExistForShoppingListId(userId, data.id);

    if (!responseIfUserIdExistForShoppingList)
      throw new HttpException(
        { message: 'No data found for userId ' + userId + ' ', Error },
        HttpStatus.BAD_REQUEST,
      );

    return await this.repository.updateShoppingList(
      this.convertShoppingListDtoToShoppingListEntity(data),
    );
  }

  async deleteShoppingListByIdAndUserId(userId: string, shoppingId: string) {
    const responseIfShoppingListExist =
      await this.getUserIdExistForShoppingListId(userId, shoppingId);

    if (!responseIfShoppingListExist)
      throw new HttpException(
        { message: 'No data found for userId ' + userId + ' ', Error },
        HttpStatus.BAD_REQUEST,
      );

    return await this.repository.deleteShoppingListById(shoppingId);
  }

  async getUserIdExistForShoppingListId(
    userId: string,
    shoppingListId: string,
  ): Promise<boolean> {
    const response = await this.repository.countUserIdExistForShoppingListId(
      userId,
      shoppingListId,
    );

    if (response === 0) return false;

    return true;
  }

  async getShoppingListByUserId(userId: string) {
    const responseShoppingLists = await this.repository.getShoppingListByUserId(
      userId,
    );

    if (!responseShoppingLists)
      throw new HttpException(
        {
          message: 'No dshopping list found for userId : ' + userId + ' ',
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );

    return responseShoppingLists;
  }

  async getProductsListByShoppingListId(
    userId: string,
    shoppingListId: string,
  ) {
    const responseIfUserIdExistForShoppingList =
      await this.getUserIdExistForShoppingListId(userId, shoppingListId);

    if (!responseIfUserIdExistForShoppingList)
      throw new HttpException(
        { message: 'No data found for userId ' + userId + ' ', Error },
        HttpStatus.BAD_REQUEST,
      );

    return await this.repository.getProductsByShoppingListId(shoppingListId);
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
