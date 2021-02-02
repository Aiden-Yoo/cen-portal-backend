import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateBundleInput } from './create-bundle.dto';

@InputType()
export class EditBundleInput extends PartialType(CreateBundleInput) {
  @Field(type => Number)
  bundleId: number;
}

@ObjectType()
export class EditBundleOutput extends CoreOutput {}
