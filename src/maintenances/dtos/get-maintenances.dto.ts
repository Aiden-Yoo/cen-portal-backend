import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Maintenance } from '../entities/maintenance.entity';

@InputType()
export class GetMaintenancesInput extends PaginationInput {
  @Field(type => String, { nullable: true })
  searchTerm?: string;

  @Field(type => String, { nullable: true })
  maintenanceStatus?: string;
}

@ObjectType()
export class GetMaintenancesOutput extends PaginationOutput {
  @Field(type => [Maintenance], { nullable: true })
  maintenances?: Maintenance[];
}
