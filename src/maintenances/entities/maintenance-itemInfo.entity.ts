import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Part } from 'src/devices/entities/part.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';
import { Maintenance } from './maintenance.entity';

@InputType('MaintenanceItemInfoInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class MaintenanceItemInfo extends CoreEntity {
  @Column()
  @Field(type => String)
  name: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  serialNumber?: string;

  @ManyToOne(
    type => Maintenance,
    maintenance => maintenance.maintenanceItemInfos,
    { onDelete: 'CASCADE' },
  )
  @Field(type => Maintenance)
  maintenance: Maintenance;

  @RelationId((itemInfo: MaintenanceItemInfo) => itemInfo.maintenance)
  maintenanceId: number;
}
