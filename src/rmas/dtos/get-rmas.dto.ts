import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { RmaClassification, Rma } from '../entities/rma.entity';

@InputType()
export class GetRmasInput extends PaginationInput {
  @Field(type => String, { nullable: true })
  rmaStatus?: string;

  @Field(type => RmaClassification, { nullable: true })
  classification?: RmaClassification;

  @Field(type => String, { nullable: true })
  searchTerm?: string;
}

@ObjectType()
export class GetRmasOutput extends PaginationOutput {
  @Field(type => [Rma], { nullable: true })
  rmas?: Rma[];
}
