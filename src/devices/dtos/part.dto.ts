import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Part } from '../entities/part.entity';

@InputType()
export class PartInput {
  @Field(type => Int)
  partId: number;
}

@ObjectType()
export class PartOutput extends CoreOutput {
  @Field(type => Part, { nullable: true })
  part?: Part;
}
