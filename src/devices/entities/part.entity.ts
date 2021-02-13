import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@InputType('PartInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Part extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column()
  @Field(type => String)
  series: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;
}
