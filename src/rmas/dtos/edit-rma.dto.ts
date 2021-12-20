import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Rma } from '../entities/rma.entity';

@InputType()
export class EditRmaInput extends PickType(Rma, [
  'id',
  'classification',
  'model',
  'projectName',
  'returnDate',
  'returnSrc',
  'returnSn',
  'deliverDate',
  'deliverDst',
  'deliverSn',
  'reenactment',
  'person',
  'description',
]) {}

@ObjectType()
export class EditRmaOutput extends CoreOutput {}
