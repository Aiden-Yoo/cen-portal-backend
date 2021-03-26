import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issues } from './entities/issues.entity';
import { IssueComments } from './entities/issue-comments.entity';
import { IssueCommentResolver, IssueResolver } from './issues.resolver';
import { IssueCommentService, IssueService } from './issues.service';
import { IssueFiles } from './entities/issue-files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issues, IssueComments, IssueFiles])],
  providers: [
    IssueResolver,
    IssueService,
    IssueCommentResolver,
    IssueCommentService,
  ],
})
export class IssuesModule {}
