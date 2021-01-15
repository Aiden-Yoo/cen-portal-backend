import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeletePartInput {
  @Field(type => Number)
  partId: number;
}

@ObjectType()
export class DeletePartOutput extends CoreOutput {}
