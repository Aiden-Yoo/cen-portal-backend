import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IssueComments } from 'src/posts/entities/issue-comments.entity';

@InputType()
export class EditIssueCommentInput extends PickType(
  PartialType(IssueComments),
  ['comment', 'depth', 'order'],
) {
  @Field(type => Number)
  commentId: number;
}

@ObjectType()
export class EditIssueCommentOutput extends CoreOutput {}
