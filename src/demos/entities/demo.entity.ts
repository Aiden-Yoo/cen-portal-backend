import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum DemoStatus {
  Release = '미반납',
  Return = '반납완료',
  Sold = '판매전환',
  Loss = '손실처리',
  Etc = '기타',
  Completed = 'Completed',
  Notcompleted = 'Notcompleted',
}

export enum Origin {
  Demo = 'Demo',
  LAB = 'LAB',
  New = '상품',
}

registerEnumType(DemoStatus, { name: 'DemoStatus' });
registerEnumType(Origin, { name: 'Origin' });

@InputType('DemoInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Demo extends CoreEntity {
  @Column({
    type: 'enum',
    enum: DemoStatus,
    default: DemoStatus.Release,
  })
  @Field(type => DemoStatus, { nullable: true })
  @IsEnum([
    DemoStatus.Release,
    DemoStatus.Return,
    DemoStatus.Sold,
    DemoStatus.Loss,
    DemoStatus.Etc,
  ])
  status: DemoStatus;

  @Column({ type: 'timestamp without time zone' })
  @Field(type => Date, { nullable: true })
  deliverDate: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @Field(type => Date, { nullable: true })
  returnDate?: Date;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  projectName: string;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  model: string;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  serialNumber: string;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  salesPerson: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  applier?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  receiver?: string;

  @Column()
  @Field(type => String, { nullable: true })
  @IsOptional()
  @IsString()
  partner: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  partnerPerson?: string;

  @Column({
    type: 'enum',
    enum: Origin,
    default: Origin.Demo,
  })
  @Field(type => Origin, { nullable: true })
  @IsOptional()
  @IsEnum(Origin)
  origin: Origin;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;
}
