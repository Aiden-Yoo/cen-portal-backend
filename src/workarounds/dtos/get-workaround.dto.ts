import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Workarounds } from 'src/workarounds/entities/workarounds.entity';

@InputType()
export class GetWorkaroundInput extends PickType(Workarounds, ['id']) {}

@ObjectType()
export class GetWorkaroundOutput extends CoreOutput {
  @Field(type => Workarounds, { nullable: true })
  workaround?: Workarounds;
}
