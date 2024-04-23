import { Test, TestingModule } from '@nestjs/testing';
import { CommitsController } from './commits.controller';
import { CommitsService } from './commits.service';

describe('CommitsController', () => {
  let controller: CommitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitsController],
      providers: [CommitsService],
    }).compile();

    controller = module.get<CommitsController>(CommitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
