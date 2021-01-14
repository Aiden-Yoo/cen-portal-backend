import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Contact } from './contact.entity';

@InputType('PartnerInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Partner extends CoreEntity {
  @Column()
  @Field(type => String)
  name: string;

  @Column()
  @Field(type => String)
  address: string;

  @OneToMany(
    type => Contact,
    contact => contact.partner,
  )
  @Field(type => [Contact])
  contacts: Contact[];

  @Column({ unique: true })
  @Field(type => String)
  @IsString()
  slug: string;
}
