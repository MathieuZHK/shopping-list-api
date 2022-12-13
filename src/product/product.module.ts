import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductRepository } from './repository/product.repository';
import { ProductService } from './service/product.service';

@Module({
  controllers: [],
  providers: [ProductService, ProductRepository, PrismaService],
})
export class ProductModule {}
