import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Partner } from '../entities/partner.entity';

@InputType()
export class CreatePartnerInput extends PickType(Partner, [
  'name',
  'address',
  'zip',
  'tel',
]) {}

@ObjectType()
export class CreatePartnerOutput extends CoreOutput {}
