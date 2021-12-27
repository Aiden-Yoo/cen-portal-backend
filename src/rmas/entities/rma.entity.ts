import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum RmaClassification {
  RMA = 'RMA',
  DoA = 'DoA',
}
export enum Reenactment {
  True = '재현됨',
  False = '재현불가',
  Later = '추후확인',
}

registerEnumType(RmaClassification, { name: 'RmaClassification' });
registerEnumType(Reenactment, { name: 'Reenactment' });

@InputType('RmaInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Rma extends CoreEntity {
  @Column({
    type: 'enum',
    enum: RmaClassification,
    default: RmaClassification.RMA,
  })
  @Field(type => RmaClassification, { nullable: true })
  @IsEnum(RmaClassification)
  classification?: RmaClassification;

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

  @Column({ type: 'enum', enum: Reenactment, default: Reenactment.Later })
  @Field(type => Reenactment, {
    nullable: true,
    defaultValue: Reenactment.Later,
  })
  @IsOptional()
  @IsEnum(Reenactment)
  reenactment?: Reenactment;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  person?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  address?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  symptom?: string;
}
