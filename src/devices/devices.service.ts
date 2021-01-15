import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundles: Repository<Bundle>
    @InjectRepository(Part)
    private readonly parts: Repository<Part>
  ) {}
}
