import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ProductOnShoppingLists } from '@prisma/client';
import { ShoppingListService } from 'src/shopping-list/service/shopping-list.service';
import { ProductCartInfoDto } from '../dto/productCartInfoDto';
import { ProductShoppingListDto } from '../dto/productShoppingList.dto';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private repository: ProductRepository,
    @Inject(forwardRef(() => ShoppingListService))
    private shoppingListService: ShoppingListService,
  ) {}

  async createProductOnShoppingList(data: ProductOnShoppingLists) {
    return await this.repository.createProductOnShoppingList(
      data.name,
      data.barcode,
      data.shoppingListId,
      data.price,
      data.qty,
      data.inCart,
    );
  }

  async deleteProductOnShoppingList(
    userId: string,
    productOnShoppingListId: string,
  ) {
    const responseShoppingList =
      await this.shoppingListService.getShoppingListWithUserIdAndProductIdExist(
        userId,
        productOnShoppingListId,
      );
    if (!responseShoppingList)
      throw new HttpException(
        {
          message:
            'No Product for : ' +
            productOnShoppingListId +
            ' for userId : ' +
            userId,
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );
    const responseProductOnShoppingList =
      await this.repository.deleteProductOnShoppingList(
        productOnShoppingListId,
      );
    return responseProductOnShoppingList;
  }

  async updateProductOnShoppingList(
    userId: string,
    data: ProductShoppingListDto,
  ) {
    const responseShoppingList =
      await this.shoppingListService.getUserIdExistForShoppingListId(
        userId,
        data.shoppingListId,
      );
    if (!responseShoppingList)
      throw new HttpException(
        {
          message:
            'No ShoppingListId : ' +
            data.shoppingListId +
            ' for userId : ' +
            userId,
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );
    return await this.repository.updateProductOnShoppingList(
      this.convertProductShoppingListDtoToProductOnShoppingListEntity(data),
    );
  }

  async createProductListOnShoppingList(data: ProductShoppingListDto[]) {
    return await this.repository.createProductListOnShoppingList(
      this.convertProductShoppingListDtoListToProductOnShoppingEntityList(data),
    );
  }

  async addProductOnShoppingList(userId: string, data: ProductShoppingListDto) {
    const responseCheckIfExistShoppingListForUserIs =
      await this.shoppingListService.getUserIdExistForShoppingListId(
        userId,
        data.shoppingListId,
      );
    if (!responseCheckIfExistShoppingListForUserIs)
      throw new HttpException(
        {
          message:
            'No ShoppingListId : ' +
            data.shoppingListId +
            ' for userId : ' +
            userId,
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );
    return await this.repository.createProductOnShoppingList(
      data.product.name,
      data.product.barcode,
      data.shoppingListId,
      data.product.price,
      data.product.qty,
      data.product.inCart,
    );
  }

  async updateProductOnShoppingListInCart(
    userId: string,
    dto: ProductCartInfoDto,
  ) {
    const responseShoppingList =
      await this.shoppingListService.getShoppingListWithUserIdAndProductIdExist(
        userId,
        dto.id,
      );
    if (!responseShoppingList)
      throw new HttpException(
        {
          message: 'No Product for : ' + dto.id + ' for userId : ' + userId,
          Error,
        },
        HttpStatus.BAD_REQUEST,
      );
    const responseProductOnShoppingList =
      await this.repository.updateProductOnShoppingListInCart(dto);
    return responseProductOnShoppingList;
  }

  convertProductShoppingListDtoToProductOnShoppingListEntity(
    data: ProductShoppingListDto,
  ) {
    if (!data) {
      return null;
    }
    const productShoppingListEntity: ProductOnShoppingLists = {
      id: data.id ? data.id : null,
      name: data.product.name,
      barcode: data.product.barcode,
      shoppingListId: data.shoppingListId,
      price: data.product.price,
      qty: data.product.qty,
      inCart: data.product.inCart,
    };

    return productShoppingListEntity;
  }

  convertProductShoppingListDtoListToProductOnShoppingEntityList(
    data: ProductShoppingListDto[],
  ) {
    if (!data) return null;
    if (data.length === 0) return null;

    let productOnShoppingList: ProductOnShoppingLists[];
    data.forEach((productOnShopping) => {
      productOnShoppingList.push(
        this.convertProductShoppingListDtoToProductOnShoppingListEntity(
          productOnShopping,
        ),
      );
    });
    return productOnShoppingList;
  }
}
