import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class ApprovalAccountInput extends PartialType(
  PickType(User, ['verified', 'isLocked', 'role']),
) {
  @Field(type => Number)
  userId: number;
}

@ObjectType()
export class ApprovalAccountOutput extends CoreOutput {}
