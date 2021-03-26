import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteIssueCommentInput {
  @Field(type => Int)
  commentId: number;
}

@ObjectType()
export class DeleteIssueCommentOutput extends CoreOutput {}
