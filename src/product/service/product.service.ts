import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Product, ProductOnShoppingLists } from '@prisma/client';
import { ShoppingListService } from 'src/shopping-list/service/shopping-list.service';
import { ProductDto } from '../dto/product.dto';
import { ProductShoppingListDto } from '../dto/productShoppingList.dto';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private repository: ProductRepository,
    @Inject(forwardRef(() => ShoppingListService))
    private shoppingListService: ShoppingListService,
  ) {}

  async createProduct(data: ProductDto) {
    return await this.repository.createProduct(
      this.convertProductDtoToProductEntity(data),
    );
  }

  async createProductList(data: ProductDto[]) {
    return await this.repository.createProductList(
      this.convertProductDtoListToProductEntityList(data),
    );
  }

  async deleteProductById(productId: string) {
    return await this.repository.deleteProductById(productId);
  }

  async deleteProductOnShoppingList(
    userId: string,
    data: ProductShoppingListDto,
  ) {
    const responseShoppingList =
      await this.shoppingListService.countUserIdExistForShoppingListId(
        userId,
        data.id,
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

    return await this.repository.deleteProductOnShoppingList(data.id);
  }

  async updateProductOnShoppingList(
    userId: string,
    data: ProductShoppingListDto,
  ) {
    const responseShoppingList =
      await this.shoppingListService.countUserIdExistForShoppingListId(
        userId,
        data.id,
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

  async createProductOnShoppingList(data: ProductOnShoppingLists) {
    return await this.repository.createProductOnShoppingList(
      data.productId,
      data.shoppingListId,
      data.price,
      data.qty,
    );
  }

  async createProductListOnShoppingList(data: ProductShoppingListDto[]) {
    return await this.repository.createProductListOnShoppingList(
      this.convertProductShoppingListDtoListToProductOnShoppingEntityList(data),
    );
  }

  async addProductOnShoppingList(userId: string, data: ProductShoppingListDto) {
    const responseCheckIfExistShoppingListForUserIs =
      await this.shoppingListService.countUserIdExistForShoppingListId(
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

    if (!data.product.id) {
      const responseGetProductByName = await this.repository.getProductByName(
        data.product.name,
      );
      if (!responseGetProductByName) {
        const responseCreateProduct = await this.repository.createProduct(
          this.convertProductDtoToProductEntity(data.product),
        );
        if (!responseCreateProduct)
          throw new HttpException(
            {
              message: 'Error when create product',
              Error,
            },
            HttpStatus.BAD_REQUEST,
          );
        return await this.repository.createProductOnShoppingList(
          responseCreateProduct.id,
          data.shoppingListId,
          data.product.price,
          data.product.qty,
        );
      }
    }
    return await this.repository.createProductOnShoppingList(
      data.product.id,
      data.shoppingListId,
      data.product.price,
      data.product.qty,
    );
  }

  convertProductDtoToProductEntity(data: ProductDto) {
    if (!data) {
      return null;
    }
    const productEntity: Product = {
      id: null,
      name: data.name,
      barcode: data.barcode,
    };
    return productEntity;
  }

  convertProductShoppingListDtoToProductOnShoppingListEntity(
    data: ProductShoppingListDto,
  ) {
    if (!data) {
      return null;
    }
    const productShoppingListEntity: ProductOnShoppingLists = {
      id: null,
      productId: data.product.id,
      shoppingListId: data.shoppingListId,
      price: data.product.price,
      qty: data.product.qty,
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

  convertProductDtoListToProductEntityList(data: ProductDto[]) {
    if (!data) return null;
    if (data.length === 0) return null;

    let productEntityList: Product[];
    data.forEach((product) => {
      productEntityList.push(this.convertProductDtoToProductEntity(product));
    });
    return productEntityList;
  }
}
