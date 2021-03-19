import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Issues } from '../../entities/issues.entity';

@InputType()
export class CreateIssueInput extends PickType(Issues, [
  'locked',
  'kind',
  'title',
  'content',
  'files',
]) {}

@ObjectType()
export class CreateIssueOutput extends CoreOutput {
  @Field(type => Issues)
  issue?: Issues;
}
