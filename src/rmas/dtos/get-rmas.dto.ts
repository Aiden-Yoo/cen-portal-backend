import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Classification, Rma } from '../entities/rma.entity';

@InputType()
export class GetRmasInput extends PaginationInput {
  @Field(type => Classification, { nullable: true })
  classification?: Classification;

  @Field(type => String, { nullable: true })
  searchTerm?: string;
}

@ObjectType()
export class GetRmasOutput extends PaginationOutput {
  @Field(type => [Rma], { nullable: true })
  rmas?: Rma[];
}
