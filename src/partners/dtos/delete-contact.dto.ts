import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteContactInput {
  @Field(type => Number)
  contactId: number;
}

@ObjectType()
export class DeleteContactOutput extends CoreOutput {}
