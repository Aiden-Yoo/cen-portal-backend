import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeletePartnerInput {
  @Field(type => Number)
  partnerId: number;
}

@ObjectType()
export class DeletePartnerOutput extends CoreOutput {}
