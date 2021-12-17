import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum Classification {
  RMA = 'RMA',
  DoA = 'DoA',
}

registerEnumType(Classification, { name: 'Classification' });

@InputType('RmaInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Rma extends CoreEntity {
  @Column({
    type: 'enum',
    enum: Classification,
    default: Classification.RMA,
  })
  @Field(type => Classification, { nullable: true })
  @IsEnum(Classification)
  classification?: Classification;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  model: string;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  projectName: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @Field(type => Date, { nullable: true })
  returnDate?: Date;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  returnSrc?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  returnSn?: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @Field(type => Date, { nullable: true })
  deliverDate?: Date;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  deliverDst?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  deliverSn?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  person?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;
}
