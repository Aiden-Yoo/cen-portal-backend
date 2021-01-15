import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
export class AllPartnersInput extends PaginationInput {}

@ObjectType()
export class AllPartnersOutput extends CoreOutput {
  @Field(type => [Partner], { nullable: true })
  partners?: Partner[];
}
