import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Contact } from '../entities/contact.entity';

@ObjectType()
export class AllContactsOutput extends CoreOutput {
  @Field(type => [Contact], { nullable: true })
  contacts?: Contact[];
}
