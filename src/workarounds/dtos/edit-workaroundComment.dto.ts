import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { WorkaroundComments } from 'src/workarounds/entities/workaround-comments.entity';

@InputType()
export class EditWorkaroundCommentInput extends PickType(
  PartialType(WorkaroundComments),
  ['comment'],
) {
  @Field(type => Number)
  commentId: number;
}

@ObjectType()
export class EditWorkaroundCommentOutput extends CoreOutput {}
