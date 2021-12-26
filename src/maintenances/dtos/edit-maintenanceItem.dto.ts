import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MaintenanceItemInfo } from '../entities/maintenance-itemInfo.entity';

@InputType()
export class EditMaintenanceItemInfoInput extends PickType(
  MaintenanceItemInfo,
  ['serialNumber'],
) {
  @Field(type => Int)
  itemInfoId: number;
}

@ObjectType()
export class EditMaintenanceItemInfoOutput extends CoreOutput {}
