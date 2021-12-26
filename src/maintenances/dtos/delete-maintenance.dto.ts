import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteMaintenanceInput {
  @Field(type => Number)
  maintenanceId: number;
}

@ObjectType()
export class DeleteMaintenanceOutput extends CoreOutput {}
