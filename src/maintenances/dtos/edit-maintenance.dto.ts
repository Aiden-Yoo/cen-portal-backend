import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Maintenance } from '../entities/maintenance.entity';

@InputType()
export class EditMaintenanceInput extends PickType(Maintenance, [
  'id',
  'salesPerson',
  'projectName',
  'reqPartner',
  'startDate',
  'endDate',
  'description',
  'classification',
  'inCharge',
  'contact',
]) {}

@ObjectType()
export class EditMaintenanceOutput extends CoreOutput {}
