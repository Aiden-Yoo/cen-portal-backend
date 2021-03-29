import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Documents } from 'src/documents/entities/documents.entity';

@InputType()
export class AllDocumentsInput extends PaginationInput {}

@ObjectType()
export class AllDocumentsOutput extends PaginationOutput {
  @Field(type => [Documents], { nullable: true })
  documents?: Documents[];
}
