import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Issues } from 'src/posts/entities/issues.entity';

@InputType('IssuesInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class IssueComments extends CoreEntity {
  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;

  @Column()
  @Field(type => String)
  @IsArray()
  files: string[];

  @ManyToOne(
    type => Issues,
    issues => issues.comment,
    { onDelete: 'CASCADE' },
  )
  @Field(type => Issues)
  post: Issues;
}
