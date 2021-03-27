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
import { WorkaroundComments } from './workaround-comments.entity';
import { WorkaroundFiles } from './workaround-files.entity';

export enum KindWorkaround {
  C2000 = 'C2000',
  C3000 = 'C3000',
  C3100 = 'C3100',
  C3300 = 'C3300',
  C5000 = 'C5000',
  C7000 = 'C7000',
  C9000 = 'C9000',
  ETC = 'ETC',
}

registerEnumType(KindWorkaround, { name: 'KindWorkaround' });

@InputType('WorkaroundsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Workarounds extends CoreEntity {
  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;

  @RelationId((workarounds: Workarounds) => workarounds.writer)
  writerId: number;

  @Column({ nullable: true, default: false })
  @Field(type => Boolean, { nullable: true })
  locked: boolean;

  @Column({ type: 'enum', enum: KindWorkaround })
  @Field(type => KindWorkaround)
  @IsEnum(KindWorkaround)
  kind: KindWorkaround;

  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;

  @OneToMany(
    type => WorkaroundFiles,
    workaroundFiles => workaroundFiles.workaround,
    { nullable: true },
  )
  @Field(type => [WorkaroundFiles], { nullable: true })
  files: WorkaroundFiles[];

  @OneToMany(
    type => WorkaroundComments,
    workaroundComments => workaroundComments.post,
    { nullable: true },
  )
  @Field(type => [WorkaroundComments], { nullable: true })
  @IsArray()
  comment?: WorkaroundComments[];

  @DeleteDateColumn({ nullable: true })
  @Field(type => Date, { nullable: true })
  deleteAt: Date;
}
