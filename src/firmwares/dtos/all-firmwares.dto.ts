import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Firmwares } from 'src/firmwares/entities/firmwares.entity';

@InputType()
export class AllFirmwaresInput extends PaginationInput {}

@ObjectType()
export class AllFirmwaresOutput extends PaginationOutput {
  @Field(type => [Firmwares], { nullable: true })
  firmwares?: Firmwares[];
}
