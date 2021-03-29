import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Documents } from 'src/documents/entities/documents.entity';

@InputType()
export class EditDocumentInput extends PickType(PartialType(Documents), [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {
  @Field(type => Number)
  documentId: number;
}

@ObjectType()
export class EditDocumentOutput extends CoreOutput {}
