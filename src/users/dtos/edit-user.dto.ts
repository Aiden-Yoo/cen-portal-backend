import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditUserOutput extends CoreOutput {}

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ['role', 'isLocked']),
) {
  @Field(type => Number)
  userId: number;
}
