import { Module } from '@nestjs/common';
import {
  WorkaroundService,
  WorkaroundCommentService,
} from './workarounds.service';
import {
  WorkaroundResolver,
  WorkaroundCommentResolver,
} from './workarounds.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workarounds } from './entities/workarounds.entity';
import { WorkaroundComments } from './entities/workaround-comments.entity';
import { WorkaroundFiles } from './entities/workaround-files.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workarounds,
      WorkaroundComments,
      WorkaroundFiles,
    ]),
  ],
  providers: [
    WorkaroundService,
    WorkaroundResolver,
    WorkaroundCommentService,
    WorkaroundCommentResolver,
  ],
})
export class WorkaroundsModule {}
