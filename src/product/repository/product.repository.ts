import { Injectable } from '@nestjs/common';
import { Product, ProductOnShoppingLists } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Product): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: data.name,
        barcode: data.barcode,
      },
    });
  }

  async createProductList(data: Product[]) {
    return this.prisma.product.createMany({
      data: data,
      skipDuplicates: true,
    });
  }

  async getProductById(productId: string): Promise<Product> {
    return this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }

  async deleteProductById(productId: string): Promise<Product> {
    return this.prisma.product.delete({
      where: {
        id: productId,
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

  async createProductOnShoppingList(productId: string, shoppingListId: string) {
    return this.prisma.productOnShoppingLists.create({
      data: {
        productId: productId,
        shoppingListId: shoppingListId,
      },
    });
  }

  async createProductListOnShoppingList(data: ProductOnShoppingLists[]) {
    return this.prisma.productOnShoppingLists.createMany({
      data: data,
    });
  }
}