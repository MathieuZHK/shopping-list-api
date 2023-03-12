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
      orderBy: [
        {
          name: 'asc',
        },
      ],
      where: {
        shoppingListId: shoppingListId,
      },
      select: {
        id: true,
        name: true,
        barcode: true,
        price: true,
        qty: true,
        inCart: true,
        shoppingListId: true,
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
    isOwner?: boolean,
  ) {
    return this.prisma.shoppingListOnUsers.count({
      where: {
        AND: { userId: userId, shoppingListId: shoppingListId, owner: isOwner },
      },
    });
  }

  async getShoppingListWithUserIdAndProductId(
    userId: string,
    productOnShoppingListId: string,
  ) {
    return this.prisma.shoppingList.findMany({
      include: {
        users: {
          where: {
            id: userId,
          },
        },
        products: {
          where: {
            id: productOnShoppingListId,
          },
        },
      },
    });
  }

  async deleteShoppingListById(shoppingListId: string) {
    return this.prisma.shoppingList.delete({
      where: {
        id: shoppingListId,
      },
    });
  }
}
