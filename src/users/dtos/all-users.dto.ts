import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { User } from '../entities/user.entity';

@InputType()
export class AllUsersInput extends PaginationInput {}

@ObjectType()
export class AllUsersOutput extends PaginationOutput {
  @Field(type => [User], { nullable: true })
  users?: User[];
}
