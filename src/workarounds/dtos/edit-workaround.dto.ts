import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Workarounds } from 'src/workarounds/entities/workarounds.entity';

@InputType()
export class EditWorkaroundInput extends PickType(PartialType(Workarounds), [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {
  @Field(type => Number)
  workaroundId: number;
}

@ObjectType()
export class EditWorkaroundOutput extends CoreOutput {}
