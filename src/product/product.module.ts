import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingListRepository } from 'src/shopping-list/repository/shopping-list.repository';
import { ShoppingListService } from 'src/shopping-list/service/shopping-list.service';
import { ProductRepository } from './repository/product.repository';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserService } from 'src/user/service/user.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    UserService,
    UserRepository,
    ShoppingListRepository,
    ShoppingListService,
    PrismaService,
  ],
})
export class ProductModule {}
