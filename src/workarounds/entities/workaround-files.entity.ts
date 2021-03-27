import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Workarounds } from './workarounds.entity';

@InputType('WorkaroundFilesInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class WorkaroundFiles extends CoreEntity {
  @Column()
  @Field(type => String)
  path: string;

  @ManyToOne(
    type => Workarounds,
    workarounds => workarounds.files,
    { onDelete: 'CASCADE', nullable: true },
  )
  @Field(type => Workarounds, { nullable: true })
  workaround: Workarounds;

  @RelationId((workaroundFiles: WorkaroundFiles) => workaroundFiles.workaround)
  workaroundId: number;
}
