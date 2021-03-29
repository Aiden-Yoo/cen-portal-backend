import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Firmwares } from './firmwares.entity';

@InputType('FirmwareFilesInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class FirmwareFiles extends CoreEntity {
  @Column()
  @Field(type => String)
  path: string;

  @ManyToOne(
    type => Firmwares,
    firmwares => firmwares.files,
    { onDelete: 'CASCADE', nullable: true },
  )
  @Field(type => Firmwares, { nullable: true })
  firmware: Firmwares;

  @RelationId((firmwareFiles: FirmwareFiles) => firmwareFiles.firmware)
  firmwareId: number;
}
