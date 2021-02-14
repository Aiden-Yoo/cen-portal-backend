import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Order } from './order.entity';

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @ManyToOne(type => Bundle, { nullable: true, onDelete: 'SET NULL' })
  @Field(type => Bundle)
  bundle: Bundle;

  @Column()
  @Field(type => Int)
  @IsNumber()
  num: number;

  @ManyToOne(type => Order, { onDelete: 'CASCADE' })
  @Field(type => Order)
  order: Order;

  // @RelationId((order: Order) => order.items)
  // orderId: number;
}
