import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Order } from '../entities/order.entity';

@InputType()
class CreateOrderItemInput {
  @Field(type => Int)
  bundleId: number;

  @Field(type => Int)
  num: number;
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
  'warranty',
]) {
  @Field(type => Int)
  partnerId: number;

  @Field(type => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
