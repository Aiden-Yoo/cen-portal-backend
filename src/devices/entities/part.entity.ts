import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Bundle } from './bundle.entity';

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
  @IsString()
  serialNumber: string;

  @ManyToOne(
    type => Bundle,
    bundle => bundle.parts,
    { onDelete: 'CASCADE' },
  )
  @Field(type => Bundle)
  bundle: Bundle;
}
