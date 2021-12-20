import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Rma } from '../entities/rma.entity';

@InputType()
export class CreateRmaInput extends PickType(Rma, [
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
export class CreateRmaOutput extends CoreOutput {}
