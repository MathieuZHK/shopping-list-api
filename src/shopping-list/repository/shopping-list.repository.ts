import { Injectable } from '@nestjs/common';
import { ShoppingList } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingListRepository {
  constructor(private prisma: PrismaService) {}

  async createShoppingList(data: ShoppingList) {
    return this.prisma.shoppingList.create({
      data: {
        name: data.name,
        createdAt: data.createdAt,
      },
    });
  }

  async updateShoppingList(shoppingList: ShoppingList) {
    return this.prisma.shoppingList.update({
      where: {
        id: shoppingList.id,
      },
      data: {
        id: shoppingList.id,
        name: shoppingList.name,
      },
    });
  }

  async getProductsByShoppingListId(shoppingListId: string) {
    return this.prisma.productOnShoppingLists.findMany({
      where: {
        shoppingListId: shoppingListId,
      },
      include: {
        product: {
          select: {
            name: true,
            barcode: true,
          },
        },
      },
    });
  }

  async createShoppingListOnUser(
    userId: string,
    shoppingListId: string,
    owner: boolean,
  ) {
    return this.prisma.shoppingListOnUsers.create({
      data: {
        userId: userId,
        shoppingListId: shoppingListId,
        owner: owner,
      },
    });
  }

  async getShoppingListByUserId(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: {
        users: {
          every: {
            userId: userId,
          },
        },
      },
    });
  }

  async countUserIdExistForShoppingListId(
    userId: string,
    shoppingListId: string,
  ) {
    return this.prisma.shoppingListOnUsers.count({
      where: {
        userId: userId,
        AND: {
          shoppingListId: shoppingListId,
        },
      },
    });
  }
}
