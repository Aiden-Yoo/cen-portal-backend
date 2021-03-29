import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Documents } from './documents.entity';

@InputType('DocumentFilesInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class DocumentFiles extends CoreEntity {
  @Column()
  @Field(type => String)
  path: string;

  @ManyToOne(
    type => Documents,
    documents => documents.files,
    { onDelete: 'CASCADE', nullable: true },
  )
  @Field(type => Documents, { nullable: true })
  document: Documents;

  @RelationId((documentFiles: DocumentFiles) => documentFiles.document)
  documentId: number;
}
