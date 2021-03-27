import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { WorkaroundComments } from 'src/workarounds/entities/workaround-comments.entity';

@InputType()
export class GetWorkaroundCommentInput extends PaginationInput {
  @Field(type => Int)
  workaroundId: number;
}

@ObjectType()
export class GetWorkaroundCommentOutput extends PaginationOutput {
  @Field(type => [WorkaroundComments], { nullable: true })
  comments?: WorkaroundComments[];
}
