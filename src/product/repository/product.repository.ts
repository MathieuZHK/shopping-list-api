import { Injectable } from '@nestjs/common';
import { ProductOnShoppingLists } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductCartInfoDto } from '../dto/productCartInfoDto';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async createProductOnShoppingList(
    name: string,
    barcode: number,
    shoppingListId: string,
    price: number,
    qty: number,
    inCart: boolean,
  ): Promise<ProductOnShoppingLists> {
    return this.prisma.productOnShoppingLists.create({
      data: {
        name: name,
        barcode: barcode,
        shoppingListId: shoppingListId,
        price: price,
        qty: qty,
        inCart: inCart,
      },
    });
  }

  async deleteProductOnShoppingList(productOnShoppingListId: string) {
    return this.prisma.productOnShoppingLists.delete({
      where: {
        id: productOnShoppingListId,
      },
    });
  }

  async createProductListOnShoppingList(data: ProductOnShoppingLists[]) {
    return this.prisma.productOnShoppingLists.createMany({
      data: data,
    });
  }

  async updateProductOnShoppingListInCart(data: ProductCartInfoDto) {
    return this.prisma.productOnShoppingLists.update({
      where: {
        id: data.id,
      },
      data: {
        inCart: data.inCart,
      },
    });
  }

  async updateProductOnShoppingList(data: ProductOnShoppingLists) {
    return this.prisma.productOnShoppingLists.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        barcode: data.barcode,
        price: data.price,
        qty: data.qty,
        inCart: data.inCart,
      },
    });
  }
}
