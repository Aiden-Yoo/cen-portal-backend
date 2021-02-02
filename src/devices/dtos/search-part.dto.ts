import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Part } from '../entities/part.entity';

@InputType()
export class SearchPartInput extends PaginationInput {
  @Field(type => String)
  query: string;
}

@ObjectType()
export class SearchPartOutput extends PaginationOutput {
  @Field(type => [Part], { nullable: true })
  parts?: Part[];
}
