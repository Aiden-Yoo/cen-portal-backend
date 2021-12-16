import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteDemoInput {
  @Field(type => Number)
  id: number;
}

@ObjectType()
export class DeleteDemoOutput extends CoreOutput {}
