import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Issues } from './issues.entity';

@InputType('IssueFilesInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class IssueFiles extends CoreEntity {
  @Column()
  @Field(type => String)
  path: string;

  @ManyToOne(
    type => Issues,
    issues => issues.files,
    { onDelete: 'CASCADE', nullable: true },
  )
  @Field(type => Issues, { nullable: true })
  issue: Issues;

  @RelationId((issueFiles: IssueFiles) => issueFiles.issue)
  issueId: number;
}
