import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteFirmwareInput {
  @Field(type => Int)
  firmwareId: number;
}

@ObjectType()
export class DeleteFirmwareOutput extends CoreOutput {}
