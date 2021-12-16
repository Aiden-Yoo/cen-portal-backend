import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { DemoStatus, Origin, Demo } from '../entities/demo.entity';

@InputType()
export class GetDemosInput extends PaginationInput {
  @Field(type => DemoStatus, { nullable: true })
  status?: DemoStatus;

  @Field(type => String, { nullable: true })
  searchTerm?: string;
}

@ObjectType()
export class GetDemosOutput extends PaginationOutput {
  @Field(type => [Demo], { nullable: true })
  demos?: Demo[];
}
