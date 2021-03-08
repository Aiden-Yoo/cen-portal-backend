import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeNotice } from './entities/home-notice.entity';
import { Issues } from './entities/issues.entity';
import { IssueComments } from './entities/issue-comments.entity';
import { IssueResolver, PostResolver } from './posts.resolver';
import { IssueService, PostService } from './posts.service';
import { IssueFiles } from './entities/issue-files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomeNotice, Issues, IssueComments])],
  providers: [
    PostResolver,
    PostService,
    IssueResolver,
    IssueService,
    IssueFiles,
  ],
})
export class PostsModule {}
