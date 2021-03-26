import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { IssueComments } from 'src/issues/entities/issue-comments.entity';

@InputType()
export class GetIssueCommentInput extends PaginationInput {
  @Field(type => Int)
  issueId: number;
}

@ObjectType()
export class GetIssueCommentOutput extends PaginationOutput {
  @Field(type => [IssueComments], { nullable: true })
  comments?: IssueComments[];
}
