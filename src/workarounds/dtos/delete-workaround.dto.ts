import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteWorkaroundInput {
  @Field(type => Int)
  workaroundId: number;
}

@ObjectType()
export class DeleteWorkaroundOutput extends CoreOutput {}
