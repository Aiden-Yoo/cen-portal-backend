import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Part } from '../entities/part.entity';

@InputType()
export class AllPartsInput extends PaginationInput {}

@ObjectType()
export class AllPartsOutput extends PaginationOutput {
  @Field(type => [Part], { nullable: true })
  parts?: Part[];
}
