import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Maintenance } from './maintenance.entity';

@InputType('MaintenanceItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class MaintenanceItem extends CoreEntity {
  @ManyToOne(type => Bundle, { nullable: true, onDelete: 'SET NULL' })
  @Field(type => Bundle, { nullable: true })
  bundle: Bundle;

  @RelationId((maintenanceItem: MaintenanceItem) => maintenanceItem.bundle)
  bundleId: number;

  @Column()
  @Field(type => Int)
  @IsNumber()
  num: number;

  @ManyToOne(
    type => Maintenance,
    maintenance => maintenance.items,
    { onDelete: 'CASCADE' },
  )
  @Field(type => Maintenance)
  maintenance: Maintenance;

  @RelationId((maintenanceItem: MaintenanceItem) => maintenanceItem.maintenance)
  maintenanceId: number;
}
