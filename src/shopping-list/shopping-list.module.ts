import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductRepository } from 'src/product/repository/product.repository';
import { ProductService } from 'src/product/service/product.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserService } from 'src/user/service/user.service';
import { ShoppingListController } from './controller/shopping-list.controller';
import { ShoppingListRepository } from './repository/shopping-list.repository';
import { ShoppingListService } from './service/shopping-list.service';

@Module({
  controllers: [ShoppingListController],
  providers: [
    ShoppingListService,
    UserService,
    UserRepository,
    ShoppingListRepository,
    ProductRepository,
    ProductService,
    PrismaService,
  ],
})
export class ShoppingListModule {}
