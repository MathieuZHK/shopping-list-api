import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingListRepository } from 'src/shopping-list/repository/shopping-list.repository';
import { ShoppingListService } from 'src/shopping-list/service/shopping-list.service';
import { ProductRepository } from './repository/product.repository';
import { ProductService } from './service/product.service';

@Module({
  controllers: [],
  providers: [
    ProductService,
    ProductRepository,
    ShoppingListRepository,
    ShoppingListService,
    PrismaService,
  ],
})
export class ProductModule {}
