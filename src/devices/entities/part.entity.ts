import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Bundle } from './bundle.entity';

@InputType('PartInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Part extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column({ nullable: true, default: 1 })
  @Field(type => Int, { nullable: true })
  num?: number;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;

  @ManyToOne(
    type => Bundle,
    bundle => bundle.parts,
    { nullable: true, onDelete: 'CASCADE' },
  )
  @Field(type => Bundle, { nullable: true })
  bundle?: Bundle;

  @RelationId((part: Part) => part.bundle)
  bundleId: number;
}
