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
import { Order } from './order.entity';

@InputType('ItemInfoInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class ItemInfo extends CoreEntity {
  @Column()
  @Field(type => String)
  name: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  serialNumber?: string;

  @ManyToOne(
    type => Order,
    order => order.itemInfos,
    { onDelete: 'CASCADE' },
  )
  @Field(type => Order)
  order: Order;

  @RelationId((itemInfo: ItemInfo) => itemInfo.order)
  orderId: number;
}
