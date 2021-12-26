import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Maintenance } from '../entities/maintenance.entity';

@InputType()
class CreateMaintenanceItemInput {
  @Field(type => Int)
  bundleId: number;

  @Field(type => Int)
  num: number;
}

@InputType()
export class CreateMaintenanceInput extends PickType(Maintenance, [
  'contractNo',
  'salesPerson',
  'projectName',
  'reqPartner',
  'startDate',
  'endDate',
  'description',
]) {
  @Field(type => Int)
  distPartnerId: number;

  @Field(type => [CreateMaintenanceItemInput])
  items: CreateMaintenanceItemInput[];
}

@ObjectType()
export class CreateMaintenanceOutput extends CoreOutput {}
