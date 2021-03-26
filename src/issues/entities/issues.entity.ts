import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { IssueComments } from './issue-comments.entity';
import { IssueFiles } from './issue-files.entity';

export enum KindRole {
  Case = 'Case',
  Question = 'Question',
  ETC = 'ETC',
}

registerEnumType(KindRole, { name: 'KindRole' });

@InputType('IssuesInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Issues extends CoreEntity {
  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;

  @RelationId((issues: Issues) => issues.writer)
  writerId: number;

  @Column({ nullable: true, default: false })
  @Field(type => Boolean, { nullable: true })
  locked: boolean;

  @Column({ type: 'enum', enum: KindRole })
  @Field(type => KindRole)
  @IsEnum(KindRole)
  kind: KindRole;

  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;

  @OneToMany(
    type => IssueFiles,
    issueFiles => issueFiles.issue,
    { nullable: true },
  )
  @Field(type => [IssueFiles], { nullable: true })
  files: IssueFiles[];

  @OneToMany(
    type => IssueComments,
    issueComments => issueComments.post,
    { nullable: true },
  )
  @Field(type => [IssueComments], { nullable: true })
  @IsArray()
  comment?: IssueComments[];

  @DeleteDateColumn({ nullable: true })
  @Field(type => Date, { nullable: true })
  deleteAt: Date;
}
