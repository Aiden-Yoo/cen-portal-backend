import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Order } from 'src/orders/entities/order.entity';

export enum UserRole {
  CENSE = 'CENSE',
  CEN = 'CEN',
  Distributor = 'Distributor',
  Partner = 'Partner',
  Client = 'Client',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(type => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column()
  @Field(type => String)
  @IsString()
  company: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  team?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  jobTitle?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  bio?: string;

  @Column({ default: false })
  @Field(type => Boolean)
  @IsBoolean()
  verified: boolean;

  @Column({ default: true })
  @Field(type => Boolean)
  @IsBoolean()
  isLocked: boolean;

  @OneToMany(
    type => Order,
    order => order.writer,
  )
  @Field(type => [Order])
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
