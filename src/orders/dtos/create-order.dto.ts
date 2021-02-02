import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Order } from '../entities/order.entity';

@InputType()
class CreateOrderItemInput {
  @Field(type => Int)
  bundleId: number;

  @Field(type => Int)
  num: number;

  // @Field(type => [OrderItemOption], { nullable: true })
  // options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput extends PickType(Order, [
  'salesPerson',
  'projectName',
  'classification',
  'demoReturnDate',
  'orderSheet',
  'destination',
  'receiver',
  'contact',
  'address',
  'deliveryDate',
  'deliveryType',
  'deliveryMethod',
  'remark',
  'status',
]) {
  @Field(type => Int)
  partnerId: number;

  @Field(type => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}

// @InputType()
// class CreateOrderItemInput {
//   @Field(type => Int)
//   dishId: number;

//   @Field(type => [OrderItemOption], { nullable: true })
//   options?: OrderItemOption[];
// }
