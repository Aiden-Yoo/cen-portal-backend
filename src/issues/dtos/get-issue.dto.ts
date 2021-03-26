import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Issues } from 'src/issues/entities/issues.entity';

@InputType()
export class GetIssueInput extends PickType(Issues, ['id']) {}

@ObjectType()
export class GetIssueOutput extends CoreOutput {
  @Field(type => Issues, { nullable: true })
  issue?: Issues;
}
