import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteIssueInput {
  @Field(type => Int)
  issueId: number;
}

@ObjectType()
export class DeleteIssueOutput extends CoreOutput {}
