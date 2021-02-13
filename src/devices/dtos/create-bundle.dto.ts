import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Bundle } from '../entities/bundle.entity';

@InputType()
class CreateBundleItemInput {
  @Field(type => Int)
  partId: number;

  @Field(type => Int, { nullable: true, defaultValue: 1 })
  num?: number;
}

@InputType()
export class CreateBundleInput extends PickType(Bundle, [
  'name',
  'series',
  'description',
]) {
  @Field(type => [CreateBundleItemInput])
  parts: CreateBundleItemInput[];
}

@ObjectType()
export class CreateBundleOutput extends CoreOutput {}
