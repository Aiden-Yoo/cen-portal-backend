import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { MaintenanceItemInfo } from '../entities/maintenance-itemInfo.entity';

@InputType()
export class GetMaintenanceItemsInput extends PaginationInput {
  @Field(type => Int)
  maintenanceId: number;
}

@ObjectType()
export class GetMaintenanceItemsOutput extends PaginationOutput {
  @Field(type => [MaintenanceItemInfo], { nullable: true })
  itemInfos?: MaintenanceItemInfo[];
}
