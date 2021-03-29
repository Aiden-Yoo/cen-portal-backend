import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Documents } from '../entities/documents.entity';

@InputType()
export class CreateDocumentInput extends PickType(Documents, [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {}

@ObjectType()
export class CreateDocumentOutput extends CoreOutput {
  @Field(type => Documents)
  document?: Documents;
}
