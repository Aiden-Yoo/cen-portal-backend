import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteDocumentInput {
  @Field(type => Int)
  documentId: number;
}

@ObjectType()
export class DeleteDocumentOutput extends CoreOutput {}
