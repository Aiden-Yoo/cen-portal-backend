import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Firmwares } from '../entities/firmwares.entity';

@InputType()
export class CreateFirmwareInput extends PickType(Firmwares, [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {}

@ObjectType()
export class CreateFirmwareOutput extends CoreOutput {
  @Field(type => Firmwares)
  firmware?: Firmwares;
}
