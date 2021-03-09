import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IssueComments } from '../../entities/issue-comments.entity';

@InputType()
export class CreateIssueCommentInput extends PickType(
  PartialType(IssueComments),
  ['comment', 'depth', 'order', 'groupNum'],
) {
  @Field(type => Int)
  issueId: number;
}

@ObjectType()
export class CreateIssueCommentOutput extends CoreOutput {}
