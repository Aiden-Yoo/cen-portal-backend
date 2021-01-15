import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Part } from './part.entity';

@InputType('BundleInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Bundle extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @OneToMany(
    type => Part,
    part => part.bundle,
    { nullable: true },
  )
  @Field(type => [Part], { nullable: true })
  parts?: Part[];
}
