import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ShoppingList } from '@prisma/client';

import { ProductService } from 'src/product/service/product.service';
import { UserService } from 'src/user/service/user.service';
import { ShoppingListDto } from '../dto/shopping-list.dto';
import { ShoppingListToShareDto } from '../dto/shopping-listToShare.dto';
import { ShoppingListRepository } from '../repository/shopping-list.repository';

@Injectable()
export class ShoppingListService {
  constructor(
    private repository: ShoppingListRepository,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    private userService: UserService,
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
        this.convertShoppingListDtoToShoppingListEntity(data, false),
      );
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
      this.convertShoppingListDtoToShoppingListEntity(data, true),
    );
  }

  async deleteShoppingListByIdAndUserId(
    userId: string,
    shoppingListId: string,
  ) {
    const responseIfShoppingListExist =
      await this.getUserIdExistForShoppingListId(userId, shoppingListId);

    if (!responseIfShoppingListExist)
      throw new HttpException(
        { message: 'No data found for userId ' + userId + ' ', Error },
        HttpStatus.BAD_REQUEST,
      );
    return await this.repository.deleteShoppingListById(shoppingListId);
  }

  async getUserIdExistForShoppingListId(
    userId: string,
    shoppingListId: string,
    isOwner?: boolean,
  ): Promise<boolean> {
    if (shoppingListId === undefined) shoppingListId === '';
    const response = await this.repository.countUserIdExistForShoppingListId(
      userId,
      shoppingListId,
      isOwner,
    );
    if (response === 0) return false;
    return true;
  }

  async getShoppingListWithUserIdAndProductIdExist(
    userId: string,
    productOnShoppingListId: string,
  ) {
    const response =
      await this.repository.getShoppingListWithUserIdAndProductId(
        userId,
        productOnShoppingListId,
      );
    return response;
  }

  async getShoppingListByUserId(userId: string) {
    const responseShoppingLists = await this.repository.getShoppingListByUserId(
      userId,
    );
    if (!responseShoppingLists)
      throw new HttpException(
        {
          message: 'No shopping list found for userId : ' + userId + ' ',
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

  async shareShoppingListToUserId(
    userIdOwner: string,
    data: ShoppingListToShareDto,
  ) {
    const responseIfUserIsOwnerExistAndIsOwnerForShoppingList =
      await this.getUserIdExistForShoppingListId(
        userIdOwner,
        data.shoppingListId,
        true,
      );
    if (!responseIfUserIsOwnerExistAndIsOwnerForShoppingList)
      throw new HttpException(
        {
          message:
            'No data found for userId ' +
            userIdOwner +
            ' or user is not owner ',
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );
    if (!data.userEmailToShare)
      throw new HttpException(
        {
          message: 'No data found for userEmailToShare ',
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );

    const responseGetUserByEmail = await this.userService.getUserByEmail(
      data.userEmailToShare,
    );
    if (!responseGetUserByEmail.email)
      throw new HttpException(
        {
          message: 'User dont exist for ' + data.userEmailToShare + ' ',
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );
    return await this.createShoppingListOnUser(
      responseGetUserByEmail.id,
      data.shoppingListId,
      false,
    );
  }

  convertShoppingListDtoToShoppingListEntity(
    data: ShoppingListDto,
    isUpdate: boolean,
  ): ShoppingList {
    const shoppingListEntity: ShoppingList = {
      id: isUpdate ? data.id : null,
      name: data.name,
      createdAt: new Date(),
    };
    return shoppingListEntity;
  }
}
