import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { OpenFoodFactsDto } from '../dto/openfoodfacts.dto';

@Injectable()
export class OpenfoodfactsService {
  constructor(
    private config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getOpenfoodfactsProductByCode(code: number) {
    const openfoodfactsUrl = this.config.get<string>('OPEN_FOOD_FACT_URL');
    const apiCallUrl =
      openfoodfactsUrl + `?code=${code}&fields=code,product_name,brands`;
    const { data } = await firstValueFrom(
      this.httpService.get(apiCallUrl).pipe(),
    );
    if (!data)
      throw new HttpException(
        { message: 'No data for code' + code + ' ', Error },
        HttpStatus.BAD_REQUEST,
      );
    const products: OpenFoodFactsDto = {
      name: data.products[0].product_name,
      brands: data.products[0].brands,
      code: data.products[0].code,
    };
    return products;
  }
}
