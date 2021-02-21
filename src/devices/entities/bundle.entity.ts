import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { BundleItem } from './bundle-item.entity';

@InputType('BundleInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Bundle extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  series: string;

  @OneToMany(
    type => BundleItem,
    bundleItem => bundleItem.bundle,
    { nullable: true },
  )
  @Field(type => [BundleItem], { nullable: true })
  parts?: BundleItem[];

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;

  @ManyToOne(
    type => OrderItem,
    orderItem => orderItem.bundle,
    { onDelete: 'CASCADE', nullable: true },
  )
  @Field(type => OrderItem, { nullable: true })
  orderItem: OrderItem;

  @RelationId((bundle: Bundle) => bundle.orderItem)
  orderItemId: number;
}
