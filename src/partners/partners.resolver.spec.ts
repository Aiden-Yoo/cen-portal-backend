import { Test, TestingModule } from '@nestjs/testing';
import { PartnersResolver } from './partners.resolver';

describe('PartnersResolver', () => {
  let resolver: PartnersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnersResolver],
    }).compile();

    resolver = module.get<PartnersResolver>(PartnersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
