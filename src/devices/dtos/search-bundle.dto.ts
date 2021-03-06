import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Bundle } from '../entities/bundle.entity';

@InputType()
export class SearchBundleInput extends PaginationInput {
  @Field(type => String)
  query: string;
}

@ObjectType()
export class SearchBundleOutput extends PaginationOutput {
  @Field(type => [Bundle], { nullable: true })
  bundles?: Bundle[];
}
