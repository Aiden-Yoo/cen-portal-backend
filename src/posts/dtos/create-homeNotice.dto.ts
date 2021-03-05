import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { HomeNotice } from '../entities/home-notice.entity';

@InputType()
export class CreateHomeNoticeInput extends PickType(HomeNotice, ['content']) {}

@ObjectType()
export class CreateHomeNoticeOutput extends CoreOutput {}
