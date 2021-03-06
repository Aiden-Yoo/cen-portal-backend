import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Issues } from 'src/issues/entities/issues.entity';

@InputType()
export class EditIssueInput extends PickType(PartialType(Issues), [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {
  @Field(type => Number)
  issueId: number;
}

@ObjectType()
export class EditIssueOutput extends CoreOutput {}
