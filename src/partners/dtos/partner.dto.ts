import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
export class PartnerInput {
  @Field(type => Int)
  partnerId: number;
}

@ObjectType()
export class PartnerOutput extends CoreOutput {
  @Field(type => Partner, { nullable: true })
  partner?: Partner;
}
