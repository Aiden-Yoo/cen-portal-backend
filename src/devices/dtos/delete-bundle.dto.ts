import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteBundleInput {
  @Field(type => Number)
  bundleId: number;
}

@ObjectType()
export class DeleteBundleOutput extends CoreOutput {}
