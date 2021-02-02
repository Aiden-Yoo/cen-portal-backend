import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreatePartnerInput } from './create-partner.dto';

@InputType()
export class EditPartnerInput extends PartialType(CreatePartnerInput) {
  @Field(type => Number)
  partnerId: number;
}

@ObjectType()
export class EditPartnerOutput extends CoreOutput {}
