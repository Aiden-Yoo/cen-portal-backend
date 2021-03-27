import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { WorkaroundComments } from '../entities/workaround-comments.entity';

@InputType()
export class CreateWorkaroundCommentInput extends PickType(
  PartialType(WorkaroundComments),
  ['comment', 'depth', 'order', 'groupNum'],
) {
  @Field(type => Int)
  workaroundId: number;
}

@ObjectType()
export class CreateWorkaroundCommentOutput extends CoreOutput {}
