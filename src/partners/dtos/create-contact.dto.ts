import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Contact } from '../entities/contact.entity';

@InputType()
export class CreateContactInput extends PickType(Contact, [
  'name',
  'jobTitle',
  'tel',
]) {
  @Field(type => Number)
  partnerId: number;
}

@ObjectType()
export class CreateContactOutput extends CoreOutput {}
