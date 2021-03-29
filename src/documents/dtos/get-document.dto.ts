import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Documents } from 'src/documents/entities/documents.entity';

@InputType()
export class GetDocumentInput extends PickType(Documents, ['id']) {}

@ObjectType()
export class GetDocumentOutput extends CoreOutput {
  @Field(type => Documents, { nullable: true })
  document?: Documents;
}
