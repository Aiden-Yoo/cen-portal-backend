import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Maintenance } from '../entities/maintenance.entity';

@InputType()
export class GetMaintenanceInput extends PickType(Maintenance, ['id']) {}

@ObjectType()
export class GetMaintenanceOutput extends CoreOutput {
  @Field(type => Maintenance, { nullable: true })
  maintenance?: Maintenance;
}
