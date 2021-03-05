import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@InputType('HomeNoticeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class HomeNotice extends CoreEntity {
  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;

  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;
}
