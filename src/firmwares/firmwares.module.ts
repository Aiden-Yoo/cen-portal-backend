import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmwareFiles } from './entities/firmware-files.entity';
import { Firmwares } from './entities/firmwares.entity';
import { FirmwareResolver } from './firmwares.resolver';
import { FirmwareService } from './firmwares.service';

@Module({
  imports: [TypeOrmModule.forFeature([Firmwares, FirmwareFiles])],
  providers: [FirmwareResolver, FirmwareService],
})
export class FirmwaresModule {}
