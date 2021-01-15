import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Bundle } from '../entities/bundle.entity';

@InputType()
export class AllBundlesInput extends PaginationInput {}

@ObjectType()
export class AllBundlesOutput extends PaginationOutput {
  @Field(type => [Bundle], { nullable: true })
  bundles?: Bundle[];
}
