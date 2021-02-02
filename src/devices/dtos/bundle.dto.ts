import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Bundle } from '../entities/bundle.entity';

@InputType()
export class BundleInput {
  @Field(type => Int)
  bundleId: number;
}

@ObjectType()
export class BundleOutput extends CoreOutput {
  @Field(type => Bundle, { nullable: true })
  bundle?: Bundle;
}
