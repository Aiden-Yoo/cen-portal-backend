import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BundleResolver, PartResolver } from './devices.resolver';
import { DeviceService } from './devices.service';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bundle, Part])],
  providers: [DeviceService, BundleResolver, PartResolver],
})
export class DevicesModule {}
