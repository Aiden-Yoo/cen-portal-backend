import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { HomeNotice } from '../entities/home-notice.entity';

@InputType()
export class GetHomeNoticeInput {}

@ObjectType()
export class GetHomeNoticeOutput extends CoreOutput {
  @Field(type => HomeNotice, { nullable: true })
  notice?: HomeNotice;
}
