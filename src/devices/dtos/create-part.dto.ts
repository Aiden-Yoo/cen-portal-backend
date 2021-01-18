import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Part } from '../entities/part.entity';

@InputType()
export class CreatePartInput extends PickType(Part, [
  'name',
  'num',
  'description',
]) {
  @Field(type => Int)
  bundleId: number;
}

@ObjectType()
export class CreatePartOutput extends CoreOutput {}
