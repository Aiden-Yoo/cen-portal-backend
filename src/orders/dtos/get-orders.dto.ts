import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import {
  Order,
  OrderClassification,
  OrderStatus,
} from '../entities/order.entity';

@InputType()
export class GetOrdersInput extends PaginationInput {
  @Field(type => OrderStatus, { nullable: true })
  status?: OrderStatus;

  @Field(type => OrderClassification, { nullable: true })
  classification?: OrderClassification;

  @Field(type => String, { nullable: true })
  searchTerm?: string;
}

@ObjectType()
export class GetOrdersOutput extends PaginationOutput {
  @Field(type => [Order], { nullable: true })
  orders?: Order[];
}
