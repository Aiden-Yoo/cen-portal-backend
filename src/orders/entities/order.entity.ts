import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsString,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Bundle } from 'src/devices/entities/bundle.entity';
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
import { ItemInfo } from './item-info.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  Created = 'Created',
  Pending = 'Pending',
  Preparing = 'Preparing',
  Canceled = 'Canceled',
  Partial = 'Partial',
  Completed = 'Completed',
}

export enum OrderClassification {
  Sale = 'Sale',
  Demo = 'Demo',
  RMA = 'RMA',
  DoA = 'DoA',
}

export enum DeliveryType {
  Partial = 'Partial',
  Total = 'Total',
}

export enum DeliveryMethod {
  Parcel = 'Parcel',
  Quick = 'Quick',
  Cargo = 'Cargo',
  Directly = 'Directly',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(OrderClassification, { name: 'OrderClassification' });
registerEnumType(DeliveryType, { name: 'DeliveryType' });
registerEnumType(DeliveryMethod, { name: 'DeliveryMethod' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @ManyToOne(
    type => User,
    user => user.orders,
    { onDelete: 'SET NULL', nullable: true },
  )
  @Field(type => User, { nullable: true })
  writer?: User;

  @RelationId((order: Order) => order.writer)
  writerId: number;

  @Column()
  @Field(type => String)
  @IsString()
  salesPerson: string;

  @Column()
  @Field(type => String)
  @IsString()
  projectName: string;

  @Column({
    type: 'enum',
    enum: OrderClassification,
  })
  @Field(type => OrderClassification)
  @IsEnum(OrderClassification)
  classification: OrderClassification;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @Field(type => Date, { nullable: true })
  demoReturnDate?: Date;

  @Column({ default: false })
  @Field(type => Boolean)
  @IsBoolean()
  orderSheet: boolean;

  @ManyToOne(
    type => Partner,
    partner => partner.orders,
    { onDelete: 'SET NULL', nullable: true },
  )
  @Field(type => Partner, { nullable: true })
  partner?: Partner;

  @RelationId((oeder: Order) => oeder.partner)
  partnerId: number;

  @Column()
  @Field(type => String)
  @IsString()
  destination: string;

  @Column()
  @Field(type => String)
  @IsString()
  receiver: string;

  @Column()
  @Field(type => String)
  @IsString()
  contact: string;

  @Column()
  @Field(type => String)
  @IsString()
  address: string;

  @Column({ type: 'timestamp without time zone' })
  @Field(type => Date)
  @IsDate()
  deliveryDate: Date;

  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.Total,
  })
  @Field(type => DeliveryType)
  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
  })
  @Field(type => DeliveryMethod)
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  remark?: string;

  @OneToMany(
    type => ItemInfo,
    itemInfo => itemInfo.order,
    { nullable: true },
  )
  @Field(type => [ItemInfo], { nullable: true })
  itemInfos?: ItemInfo[];

  @Field(type => [OrderItem])
  @ManyToMany(type => OrderItem)
  @JoinTable()
  items: OrderItem[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Created })
  @Field(type => OrderStatus)
  // @IsEnum(OrderStatus)
  status?: OrderStatus;
}
