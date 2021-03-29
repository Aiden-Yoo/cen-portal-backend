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
import { DocumentFiles } from './document-files.entity';

export enum KindDocument {
  Datasheet = 'Datasheet',
  Proposal = 'Proposal',
  Certificate = 'Certificate',
  TestReport = 'TestReport',
  Brochure = 'Brochure',
  ETC = 'ETC',
}

registerEnumType(KindDocument, { name: 'KindDocument' });

@InputType('DocumentsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Documents extends CoreEntity {
  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;

  @RelationId((documents: Documents) => documents.writer)
  writerId: number;

  @Column({ nullable: true, default: false })
  @Field(type => Boolean, { nullable: true })
  locked: boolean;

  @Column({ type: 'enum', enum: KindDocument })
  @Field(type => KindDocument)
  @IsEnum(KindDocument)
  kind: KindDocument;

  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;

  @OneToMany(
    type => DocumentFiles,
    documentFiles => documentFiles.document,
    { nullable: true },
  )
  @Field(type => [DocumentFiles], { nullable: true })
  files: DocumentFiles[];

  @DeleteDateColumn({ nullable: true })
  @Field(type => Date, { nullable: true })
  deleteAt: Date;
}
