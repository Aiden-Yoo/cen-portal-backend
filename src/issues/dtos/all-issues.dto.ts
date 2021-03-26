import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Issues } from 'src/issues/entities/issues.entity';

@InputType()
export class AllIssuesInput extends PaginationInput {}

@ObjectType()
export class AllIssuesOutput extends PaginationOutput {
  @Field(type => [Issues], { nullable: true })
  issues?: Issues[];
}
