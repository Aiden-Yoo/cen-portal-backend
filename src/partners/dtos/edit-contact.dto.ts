import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Contact } from '../entities/contact.entity';

@InputType()
export class EditContactInput extends PickType(PartialType(Contact), [
  'name',
  'tel',
  'jobTitle',
]) {
  @Field(type => Number)
  contactId: number;
}

@ObjectType()
export class EditContactOutput extends CoreOutput {}
