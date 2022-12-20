import { Test, TestingModule } from '@nestjs/testing';
import { OpenfoodfactsController } from './openfoodfacts.controller';

describe('OpenfactfoodController', () => {
  let controller: OpenfoodfactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenfoodfactsController],
    }).compile();

    controller = module.get<OpenfoodfactsController>(OpenfoodfactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
