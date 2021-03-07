import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { IssueComments } from './issue-comments.entity';

@InputType('IssuesInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Issues extends CoreEntity {
  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;

  @Column()
  @Field(type => String)
  @IsBoolean()
  locked: boolean;

  @Column()
  @Field(type => String)
  @IsString()
  kind: string;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;

  @Column()
  @Field(type => String)
  @IsArray()
  files: string[];

  @OneToMany(
    type => IssueComments,
    issueComments => issueComments.post,
    { nullable: true },
  )
  @Field(type => [IssueComments], { nullable: true })
  comment: IssueComments[];
}
