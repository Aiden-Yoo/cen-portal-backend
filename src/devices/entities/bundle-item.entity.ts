import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Bundle } from './bundle.entity';
import { Part } from './part.entity';

@InputType('BundleItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class BundleItem extends CoreEntity {
  @ManyToOne(
    type => Part,
    { onDelete: 'NO ACTION' },
  )
  @Field(type => Part)
  part: Part;

  @Column({ nullable: true, default: 1 })
  @Field(type => Int, { nullable: true })
  num?: number;

  @ManyToOne(
    type => Bundle,
    bundle => bundle.parts,
    { nullable: true, onDelete: 'CASCADE' },
  )
  @Field(type => Bundle, { nullable: true })
  bundle?: Bundle;
}