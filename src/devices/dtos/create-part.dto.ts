import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Part } from '../entities/part.entity';

@InputType()
export class CreatePartInput extends PickType(Part, ['name', 'number']) {
  @Field(type => Number)
  bundleId: number;
}

@ObjectType()
export class CreatePartOutput extends CoreOutput {}
