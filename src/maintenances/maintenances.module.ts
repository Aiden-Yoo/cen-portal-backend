import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenances.service';
import { MaintenanceResolver } from './maintenances.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { MaintenanceItem } from './entities/maintenance-item.entity';
import { MaintenanceItemInfo } from './entities/maintenance-itemInfo.entity';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Partner } from 'src/partners/entities/partner.entity';
import { Part } from 'src/devices/entities/part.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Maintenance,
      MaintenanceItem,
      MaintenanceItemInfo,
      Bundle,
      Partner,
      Part,
    ]),
  ],
  providers: [MaintenanceService, MaintenanceResolver],
})
export class MaintanencesModule {}
