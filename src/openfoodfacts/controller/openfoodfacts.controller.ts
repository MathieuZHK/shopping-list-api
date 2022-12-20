import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { OpenfoodfactsService } from '../service/openfoodfacts.service';

@Controller('openfoodfacts')
export class OpenfoodfactsController {
  constructor(private openfoodfactsService: OpenfoodfactsService) {}

  @Get('openfoodfactsProductsByCode/:code')
  @Public()
  @HttpCode(HttpStatus.OK)
  getOpenfoodfactsProductsByCode(@Param('code') code: number) {
    return this.openfoodfactsService.getOpenfoodfactsProductByCode(code);
  }
}
