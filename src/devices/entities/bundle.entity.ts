import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Part } from './part.entity';

@InputType('BundleInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Bundle extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @OneToMany(
    type => Part,
    part => part.bundle,
    { nullable: true },
  )
  @Field(type => [Part], { nullable: true })
  parts?: Part[];

  @ManyToOne(
    type => OrderItem,
    orderItem => orderItem.bundle,
    { onDelete: 'CASCADE' },
  )
  @Field(type => OrderItem)
  orderItem: OrderItem;
}
