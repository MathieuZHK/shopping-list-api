import { Injectable } from '@nestjs/common';
import { Product, ProductOnShoppingLists } from '@prisma/client';
import { ProductDto } from '../dto/product.dto';
import { ProductShoppingListDto } from '../dto/productShoppingList.dto';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private repository: ProductRepository) {}

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

  async createProductOnShoppingList(productId: string, shoppingListId: string) {
    return await this.repository.createProductOnShoppingList(
      productId,
      shoppingListId,
    );
  }

  async createProductListOnShoppingList(data: ProductShoppingListDto[]) {
    return await this.repository.createProductListOnShoppingList(
      this.convertProductShoppingListDtoListToProductOnShoppingEntityList(data),
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
      productId: data.productId,
      shoppingListId: data.shoppingListId,
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
