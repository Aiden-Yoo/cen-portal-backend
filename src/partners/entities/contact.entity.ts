import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Partner } from './partner.entity';

@InputType('ContactInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Contact extends CoreEntity {
  @Column()
  @Field(type => String)
  name: string;

  @Column()
  @Field(type => String)
  tel: string;

  @ManyToOne(
    type => Partner,
    partner => partner.contacts,
    { onDelete: 'CASCADE' },
  )
  @Field(type => Partner)
  partner: Partner;
}
