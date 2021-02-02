import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, isNumber } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @ManyToOne(type => Bundle, { nullable: true, onDelete: 'CASCADE' })
  @Field(type => Bundle)
  bundle: Bundle;

  // @RelationId((orderItem: OrderItem) => orderItem.bundle)
  // bundleId: number;

  @Column()
  @Field(type => Int)
  @IsNumber()
  num: number;
}
