import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OpenfoodfactsController } from './controller/openfoodfacts.controller';
import { OpenfoodfactsService } from './service/openfoodfacts.service';

@Module({
  imports: [HttpModule],
  controllers: [OpenfoodfactsController],
  providers: [OpenfoodfactsService],
})
export class OpenfoodfactsModule {}
