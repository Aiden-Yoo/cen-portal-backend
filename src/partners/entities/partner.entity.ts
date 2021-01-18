import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
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

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  zip?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  tel?: string;

  @OneToMany(
    type => Contact,
    contact => contact.partner,
    { nullable: true },
  )
  @Field(type => [Contact], { nullable: true })
  contacts?: Contact[];

  @OneToMany(
    type => Order,
    order => order.partner,
    { nullable: true },
  )
  @Field(type => [Order], { nullable: true })
  orders?: Order[];
}
