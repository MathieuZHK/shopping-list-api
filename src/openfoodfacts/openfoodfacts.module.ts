import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OpenfoodfactsController } from 'src/openfoodfacts/controller/openfoodfacts.controller';
import { OpenfoodfactsService } from 'src/openfoodfacts/service/openfoodfacts.service';

@Module({
  imports: [HttpModule],
  controllers: [OpenfoodfactsController],
  providers: [OpenfoodfactsService],
})
export class OpenfoodfactsModule {}
