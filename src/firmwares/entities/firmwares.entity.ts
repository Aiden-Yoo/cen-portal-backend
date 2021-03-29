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
import { FirmwareFiles } from './firmware-files.entity';

export enum KindFirmware {
  C2000 = 'C2000',
  C3000 = 'C3000',
  C3100 = 'C3100',
  C3300 = 'C3300',
  C5000 = 'C5000',
  C7000 = 'C7000',
  C9000 = 'C9000',
  ETC = 'ETC',
}

registerEnumType(KindFirmware, { name: 'KindFirmware' });

@InputType('FirmwaresInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Firmwares extends CoreEntity {
  @ManyToOne(type => User, { onDelete: 'SET NULL', nullable: true })
  @Field(type => User, { nullable: true })
  writer: User;

  @RelationId((firmwares: Firmwares) => firmwares.writer)
  writerId: number;

  @Column({ nullable: true, default: false })
  @Field(type => Boolean, { nullable: true })
  locked: boolean;

  @Column({ type: 'enum', enum: KindFirmware })
  @Field(type => KindFirmware)
  @IsEnum(KindFirmware)
  kind: KindFirmware;

  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;

  @OneToMany(
    type => FirmwareFiles,
    firmwareFiles => firmwareFiles.firmware,
    { nullable: true },
  )
  @Field(type => [FirmwareFiles], { nullable: true })
  files: FirmwareFiles[];

  @DeleteDateColumn({ nullable: true })
  @Field(type => Date, { nullable: true })
  deleteAt: Date;
}
