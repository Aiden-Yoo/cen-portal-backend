import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Firmwares } from 'src/firmwares/entities/firmwares.entity';

@InputType()
export class GetFirmwareInput extends PickType(Firmwares, ['id']) {}

@ObjectType()
export class GetFirmwareOutput extends CoreOutput {
  @Field(type => Firmwares, { nullable: true })
  firmware?: Firmwares;
}
