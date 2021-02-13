import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BundleResolver, PartResolver } from './devices.resolver';
import { DeviceService } from './devices.service';
import { BundleItem } from './entities/bundle-item.entity';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bundle, Part, BundleItem])],
  providers: [DeviceService, BundleResolver, PartResolver],
})
export class DevicesModule {}
