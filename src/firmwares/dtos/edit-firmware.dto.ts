import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Firmwares } from 'src/firmwares/entities/firmwares.entity';

@InputType()
export class EditFirmwareInput extends PickType(PartialType(Firmwares), [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {
  @Field(type => Number)
  firmwareId: number;
}

@ObjectType()
export class EditFirmwareOutput extends CoreOutput {}
