import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationInput } from 'src/common/dtos/pagination.dto';
import { Issues } from 'src/posts/entities/issues.entity';

@InputType()
export class GetIssueCommentInput extends PaginationInput {
  @Field(type => Int)
  issueId: number;
}

@ObjectType()
export class GetIssueCommentOutput extends CoreOutput {
  @Field(type => [Issues], { nullable: true })
  issues?: Issues[];
}
