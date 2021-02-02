import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ItemInfo } from '../entities/item-info.entity';

@InputType()
export class EditItemInfoInput extends PickType(ItemInfo, ['serialNumber']) {
  @Field(type => Int)
  itemInfoId: number;
}

@ObjectType()
export class EditItemInfoOutput extends CoreOutput {}
