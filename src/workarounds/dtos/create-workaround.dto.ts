import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Workarounds } from '../entities/workarounds.entity';

@InputType()
export class CreateWorkaroundInput extends PickType(Workarounds, [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {}

@ObjectType()
export class CreateWorkaroundOutput extends CoreOutput {
  @Field(type => Workarounds)
  workaround?: Workarounds;
}
