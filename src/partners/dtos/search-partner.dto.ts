import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
export class SearchPartnerInput extends PaginationInput {
  @Field(type => String)
  query: string;
}

@ObjectType()
export class SearchPartnerOutput extends PaginationOutput {
  @Field(type => [Partner], { nullable: true })
  partners?: Partner[];
}
