import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Partner } from 'src/partners/entities/partner.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { MaintenanceItemInfo } from './maintenance-itemInfo.entity';
import { MaintenanceItem } from './maintenance-item.entity';

export enum MaintenanceClassification {
  CSTY = 'CSTY',
  CSTC = 'CSTC',
}

registerEnumType(MaintenanceClassification, {
  name: 'MaintenanceClassification',
});

@InputType('RmaInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Maintenance extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsOptional()
  @IsString()
  contractNo: string;

  @ManyToOne(
    type => User,
    user => user.maintenances,
    { onDelete: 'SET NULL', nullable: true },
  )
  @Field(type => User, { nullable: true })
  writer?: User;

  @RelationId((maintenance: Maintenance) => maintenance.writer)
  writerId: number;

  @Column()
  @Field(type => String)
  @IsString()
  salesPerson: string;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  projectName: string;

  @ManyToOne(
    type => Partner,
    partner => partner.maintenances,
    { onDelete: 'SET NULL', nullable: true },
  )
  @Field(type => Partner, { nullable: true })
  distPartner?: Partner;

  @RelationId((maintenance: Maintenance) => maintenance.distPartner)
  distPartnerId: number;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  reqPartner?: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @Field(type => Date, { nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @Field(type => Date, { nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;

  @Field(type => [MaintenanceItem])
  @ManyToMany(type => MaintenanceItem)
  @JoinTable()
  items: MaintenanceItem[];

  @RelationId((maintenance: Maintenance) => maintenance.items)
  itemsId: number;

  @OneToMany(
    type => MaintenanceItemInfo,
    maintenanceItemInfo => maintenanceItemInfo.maintenance,
    { nullable: true },
  )
  @Field(type => [MaintenanceItemInfo], { nullable: true })
  maintenanceItemInfos?: MaintenanceItemInfo[];

  @Column({
    type: 'enum',
    enum: MaintenanceClassification,
    default: MaintenanceClassification.CSTC,
  })
  @Field(type => MaintenanceClassification, {
    nullable: true,
    defaultValue: MaintenanceClassification.CSTC,
  })
  @IsOptional()
  @IsEnum(MaintenanceClassification)
  classification?: MaintenanceClassification;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  inCharge?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  contact?: string;
}
