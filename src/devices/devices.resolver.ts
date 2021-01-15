import { Resolver } from '@nestjs/graphql';
import { DeviceService } from './devices.service';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Resolver(of => Bundle)
export class BundleResolver {
  constructor(private readonly deviceService: DeviceService) {}
}

@Resolver(of => Part)
export class PartResolver {
  constructor(private readonly deviceService: DeviceService) {}
}
