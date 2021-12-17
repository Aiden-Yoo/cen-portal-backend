import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteRmaInput {
  @Field(type => Number)
  id: number;
}

@ObjectType()
export class DeleteRmaOutput extends CoreOutput {}
