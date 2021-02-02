import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
export class AllPartnersInput extends PaginationInput {}

@ObjectType()
export class AllPartnersOutput extends PaginationOutput {
  @Field(type => [Partner], { nullable: true })
  partners?: Partner[];
}
