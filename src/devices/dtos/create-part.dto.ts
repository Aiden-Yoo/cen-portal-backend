import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Part } from '../entities/part.entity';

@InputType()
export class CreatePartInput extends PickType(Part, [
  'name',
  'series',
  'description',
]) {}

@ObjectType()
export class CreatePartOutput extends CoreOutput {}
