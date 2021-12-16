import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Demo } from '../entities/demo.entity';

@InputType()
export class EditDemoInput extends PickType(Demo, [
  'id',
  'status',
  'deliverDate',
  'returnDate',
  'projectName',
  'model',
  'serialNumber',
  'salesPerson',
  'applier',
  'receiver',
  'partner',
  'partnerPerson',
  'origin',
  'description',
]) {}

@ObjectType()
export class EditDemoOutput extends CoreOutput {}
