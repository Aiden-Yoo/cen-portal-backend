import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { ItemInfo } from '../entities/item-info.entity';

@InputType()
export class GetOrderItemsInput extends PaginationInput {
  @Field(type => Int)
  orderId: number;
}

@ObjectType()
export class GetOrderItemsOutput extends PaginationOutput {
  @Field(type => [ItemInfo], { nullable: true })
  itemInfos?: ItemInfo[];
}
