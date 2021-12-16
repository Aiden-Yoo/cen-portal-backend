import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Demo } from '../entities/demo.entity';

@InputType()
export class CreateDemoInput extends PickType(Demo, [
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
export class CreateDemoOutput extends CoreOutput {}
