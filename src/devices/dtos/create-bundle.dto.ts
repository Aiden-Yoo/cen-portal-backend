import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Bundle } from '../entities/bundle.entity';

@InputType()
export class CreateBundleInput extends PickType(Bundle, ['name']) {}

@ObjectType()
export class CreateBundleOutput extends CoreOutput {}
