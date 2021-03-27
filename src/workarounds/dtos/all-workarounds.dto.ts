import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Workarounds } from 'src/workarounds/entities/workarounds.entity';

@InputType()
export class AllWorkaroundsInput extends PaginationInput {}

@ObjectType()
export class AllWorkaroundsOutput extends PaginationOutput {
  @Field(type => [Workarounds], { nullable: true })
  workarounds?: Workarounds[];
}
