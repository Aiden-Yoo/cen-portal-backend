import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  PostService,
  IssueService,
  IssueCommentService,
} from './posts.service';
import { HomeNotice } from './entities/home-notice.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateHomeNoticeInput,
  CreateHomeNoticeOutput,
} from './dtos/create-homeNotice.dto';
import { GetHomeNoticeOutput } from './dtos/get-homeNotice.dto';
import { Issues } from './entities/issues.entity';
import {
  CreateIssueInput,
  CreateIssueOutput,
} from './dtos/issues/create-issue.dto';
import { AllIssuesInput, AllIssuesOutput } from './dtos/issues/all-issues.dto';
import {
  DeleteIssueInput,
  DeleteIssueOutput,
} from './dtos/issues/delete-issue.dto';
import { EditIssueInput, EditIssueOutput } from './dtos/issues/edit-issue.dto';
import { GetIssueInput, GetIssueOutput } from './dtos/issues/get-issue.dto';
import {
  CreateIssueCommentInput,
  CreateIssueCommentOutput,
} from './dtos/issues/create-issueComment.dto';
import { IssueComments } from './entities/issue-comments.entity';
import {
  GetIssueCommentInput,
  GetIssueCommentOutput,
} from './dtos/issues/get-issueComments.dto';
import {
  DeleteIssueCommentInput,
  DeleteIssueCommentOutput,
} from './dtos/issues/delete-issueComment.dto';

@Resolver(of => HomeNotice)
export class PostResolver {
  constructor(private readonly postsService: PostService) {}

  @Mutation(returns => CreateHomeNoticeOutput)
  @Role(['CENSE'])
  async createHomeNotice(
    @AuthUser() writer: User,
    @Args('input') createHomeNoticeInput: CreateHomeNoticeInput,
  ): Promise<CreateHomeNoticeOutput> {
    return this.postsService.createHomeNotice(writer, createHomeNoticeInput);
  }

  @Query(returns => GetHomeNoticeOutput)
  async getHomeNotice(): Promise<GetHomeNoticeOutput> {
    return this.postsService.getHomeNotice();
  }
}

@Resolver(of => Issues)
export class IssueResolver {
  constructor(private readonly issuesService: IssueService) {}

  @Query(returns => AllIssuesOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async allIssues(
    @AuthUser() user: User,
    @Args('input') allIssuesInput: AllIssuesInput,
  ): Promise<AllIssuesOutput> {
    return this.issuesService.allIssues(user, allIssuesInput);
  }

  @Query(returns => GetIssueOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async getIssue(
    @AuthUser() user: User,
    @Args('input') getIssuesInput: GetIssueInput,
  ): Promise<GetIssueOutput> {
    return this.issuesService.getIssue(user, getIssuesInput);
  }

  @Mutation(returns => CreateIssueOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async createIssue(
    @AuthUser() writer: User,
    @Args('input') createIssueInput: CreateIssueInput,
  ): Promise<CreateIssueOutput> {
    return this.issuesService.createIssue(writer, createIssueInput);
  }

  @Mutation(returns => DeleteIssueOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async deleteIssue(
    @AuthUser() user: User,
    @Args('input') deleteIssueInput: DeleteIssueInput,
  ): Promise<DeleteIssueOutput> {
    return this.issuesService.deleteIssue(user, deleteIssueInput);
  }

  @Mutation(returns => EditIssueOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async editIssue(
    @AuthUser() user: User,
    @Args('input') editIssueInput: EditIssueInput,
  ): Promise<EditIssueOutput> {
    return this.issuesService.editIssue(user, editIssueInput);
  }
}

@Resolver(of => IssueComments)
export class IssueCommentResolver {
  constructor(private readonly issueCommentsService: IssueCommentService) {}

  @Query(returns => GetIssueCommentOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async getIssueComment(
    @Args('input') getIssueCommentInput: GetIssueCommentInput,
  ): Promise<GetIssueCommentOutput> {
    return this.issueCommentsService.getIssueComment(getIssueCommentInput);
  }

  @Mutation(returns => CreateIssueCommentOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async createIssueComment(
    @AuthUser() writer: User,
    @Args('input') createIssueCommentInput: CreateIssueCommentInput,
  ): Promise<CreateIssueCommentOutput> {
    return this.issueCommentsService.createIssueComment(
      writer,
      createIssueCommentInput,
    );
  }

  @Mutation(returns => DeleteIssueCommentOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async deleteIssueComment(
    @AuthUser() user: User,
    @Args('input') deleteIssueCommentInput: DeleteIssueCommentInput,
  ): Promise<DeleteIssueCommentOutput> {
    return this.issueCommentsService.deleteIssueComment(
      user,
      deleteIssueCommentInput,
    );
  }
}
