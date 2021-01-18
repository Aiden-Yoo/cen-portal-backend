import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Part } from '../entities/part.entity';

@InputType()
export class EditPartInput extends PickType(PartialType(Part), [
  'name',
  'description',
]) {
  @Field(type => Number)
  partId: number;
}

@ObjectType()
export class EditPartOutput extends CoreOutput {}
