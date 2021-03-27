import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Workarounds } from 'src/workarounds/entities/workarounds.entity';

@InputType('WorkaroundCommentsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class WorkaroundComments extends CoreEntity {
  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;

  @RelationId((comments: WorkaroundComments) => comments.writer)
  writerId: number;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  comment: string;

  @ManyToOne(
    type => Workarounds,
    workarounds => workarounds.comment,
    { onDelete: 'CASCADE' },
  )
  @Field(type => Workarounds)
  post: Workarounds;

  @RelationId((comments: WorkaroundComments) => comments.post)
  postId: number;

  // 동일 그룹 내 계층. 1부터 시작
  @Column({ default: 1 })
  @Field(type => Int)
  @IsNumber()
  depth?: number;

  // 동일 그룹 내 순서. 1부터 시작
  @Column({ default: 1 })
  @Field(type => Int)
  @IsNumber()
  order?: number;

  @Column({ default: 1, nullable: true })
  @Field(type => Int, { nullable: true })
  @IsNumber()
  groupNum?: number;

  @DeleteDateColumn({ nullable: true })
  @Field(type => Date, { nullable: true })
  deleteAt: Date;
}
