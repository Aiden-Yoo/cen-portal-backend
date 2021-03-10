import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateHomeNoticeInput,
  CreateHomeNoticeOutput,
} from './dtos/create-homeNotice.dto';
import { GetHomeNoticeOutput } from './dtos/get-homeNotice.dto';
import { AllIssuesInput, AllIssuesOutput } from './dtos/issues/all-issues.dto';
import {
  CreateIssueInput,
  CreateIssueOutput,
} from './dtos/issues/create-issue.dto';
import {
  CreateIssueCommentInput,
  CreateIssueCommentOutput,
} from './dtos/issues/create-issueComment.dto';
import {
  DeleteIssueInput,
  DeleteIssueOutput,
} from './dtos/issues/delete-issue.dto';
import {
  DeleteIssueCommentInput,
  DeleteIssueCommentOutput,
} from './dtos/issues/delete-issueComment.dto';
import { EditIssueInput, EditIssueOutput } from './dtos/issues/edit-issue.dto';
import {
  EditIssueCommentInput,
  EditIssueCommentOutput,
} from './dtos/issues/edit-issueComment.dto';
import { GetIssueInput, GetIssueOutput } from './dtos/issues/get-issue.dto';
import {
  GetIssueCommentInput,
  GetIssueCommentOutput,
} from './dtos/issues/get-issueComments.dto';
import { HomeNotice } from './entities/home-notice.entity';
import { IssueComments } from './entities/issue-comments.entity';
import { Issues } from './entities/issues.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(HomeNotice)
    private readonly homeNotices: Repository<HomeNotice>,
  ) {}

  async createHomeNotice(
    writer: User,
    createOrderInput: CreateHomeNoticeInput,
  ): Promise<CreateHomeNoticeOutput> {
    try {
      const changed = await this.homeNotices.findOne({ order: { id: 'DESC' } });
      if (changed?.content === createOrderInput.content) {
        return { ok: false, error: '변경 사항이 발견되지 않았습니다.' };
      } else {
        await this.homeNotices.save(
          this.homeNotices.create({
            writer,
            ...createOrderInput,
          }),
        );
      }
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '공지를 저장할 수 없습니다.',
      };
    }
  }

  async getHomeNotice(): Promise<GetHomeNoticeOutput> {
    try {
      const notice = await this.homeNotices.findOne({
        order: { id: 'DESC' },
      });
      return {
        ok: true,
        notice,
      };
    } catch (e) {
      return {
        ok: false,
        error: '공지를 불러올 수 없습니다.',
      };
    }
  }
}

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issues)
    private readonly issues: Repository<Issues>,
  ) {}

  canSeePost(user: User, issue: Issues): boolean {
    let canSee = false;
    if (user.role === UserRole.CENSE || issue.writerId === user.id) {
      canSee = true;
    }
    return canSee;
  }

  async allIssues(
    user: User,
    { page, take }: AllIssuesInput,
  ): Promise<AllIssuesOutput> {
    try {
      let issues: Issues[];
      let totalResults: number;
      if (user.role === UserRole.CENSE) {
        [issues, totalResults] = await this.issues.findAndCount({
          where: {
            locked: false,
          },
          skip: (page - 1) * take,
          take,
          order: { id: 'ASC' },
          relations: ['writer', 'files'],
        });
      } else {
        [issues, totalResults] = await this.issues.findAndCount({
          where: {
            locked: false,
            writer: user,
          },
          skip: (page - 1) * take,
          take,
          order: { id: 'ASC' },
          relations: ['writer', 'files'],
        });
      }
      return {
        ok: true,
        issues,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 불러올 수 없습니다.',
      };
    }
  }

  async getIssue(
    user: User,
    { id: issueId }: GetIssueInput,
  ): Promise<GetIssueOutput> {
    try {
      const issue = await this.issues.findOne(issueId);
      if (!issue) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (!this.canSeePost(user, issue)) {
        return {
          ok: false,
          error: '작성자만 볼 수 있습니다.',
        };
      }
      return {
        ok: true,
        issue,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 불러올 수 없습니다.',
      };
    }
  }

  async createIssue(
    writer: User,
    createIssueInput: CreateIssueInput,
  ): Promise<CreateIssueOutput> {
    try {
      await this.issues.save(
        this.issues.create({
          writer,
          ...createIssueInput,
        }),
      );
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 생성할 수 없습니다.',
      };
    }
  }

  async deleteIssue(
    user: User,
    { issueId }: DeleteIssueInput,
  ): Promise<DeleteIssueOutput> {
    try {
      const issue = await this.issues.findOne(issueId);
      if (!issue) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (user.role !== UserRole.CENSE) {
        if (issue.writerId !== user.id) {
          return {
            ok: false,
            error: '본인이 작성한 포스트만 삭제할 수 있습니다.',
          };
        }
      }
      await this.issues.softDelete(issueId);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '포스트를 삭제할 수 없습니다.',
      };
    }
  }

  async editIssue(
    user: User,
    { issueId, content, files, kind, locked }: EditIssueInput,
  ): Promise<EditIssueOutput> {
    try {
      const issue = await this.issues.findOne(issueId);
      if (!issue) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (!this.canSeePost(user, issue)) {
        return {
          ok: false,
          error: '작성자만 볼 수 있습니다.',
        };
      }
      await this.issues.save({
        id: issueId,
        content,
        files,
        kind,
        locked,
      });
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 수정할 수 없습니다.',
      };
    }
  }
}

@Injectable()
export class IssueCommentService {
  constructor(
    @InjectRepository(IssueComments)
    private readonly issueComments: Repository<IssueComments>,
    @InjectRepository(Issues)
    private readonly issues: Repository<Issues>,
  ) {}

  async getIssueComment({
    issueId,
    take,
    page,
  }: GetIssueCommentInput): Promise<GetIssueCommentOutput> {
    try {
      const issue = await this.issues.findOne(issueId);
      if (!issue) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      const [comments, totalResults] = await this.issueComments.findAndCount({
        where: {
          post: issue,
        },
        skip: (page - 1) * take,
        take,
        order: {
          groupNum: 'ASC',
          depth: 'ASC',
          order: 'ASC',
        },
      });
      return {
        ok: true,
        comments,
        totalResults,
        totalPages: Math.ceil(totalResults / take),
      };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 불러올 수 없습니다.',
      };
    }
  }

  async createIssueComment(
    writer: User,
    { issueId, depth, comment, groupNum, order }: CreateIssueCommentInput,
  ): Promise<CreateIssueCommentOutput> {
    // issueId,comment - 필수
    // order - 자동
    // groupNum - 선택. 없으면(댓) 생성, 있으면(대댓) order+1,
    // depth - 선택. 대댓 시 지정
    try {
      const post = await this.issues.findOne(issueId);
      if (!post) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }

      if (groupNum) {
        // if groupNum exist, order + 1
        const group = await this.issueComments.findOne({
          where: {
            groupNum,
          },
          order: { order: 'DESC' },
        });
        if (!group) {
          return {
            ok: false,
            error: '그룹을 찾을 수 없습니다.',
          };
        }
        if (group && depth) {
          // find same depth. if exist, order +1 or =1
          const equalDepth = await this.issueComments.findOne({
            where: { groupNum, depth },
            order: { order: 'DESC' },
          });
          if (equalDepth) {
            // order+1
            order = group.order + 1;
          } else {
            // order=1
            order = 1;
          }
        } else {
          return {
            ok: false,
            error: '포스트를 생성할 수 없습니다.(depth 누락)',
          };
        }
      } else {
        // if new comment, last groupNum + 1
        const lastGroup = await this.issueComments.findOne({
          order: { groupNum: 'DESC' },
        });
        if (lastGroup.groupNum !== 1) {
          groupNum = lastGroup.groupNum + 1;
        }
      }

      await this.issueComments.save(
        this.issueComments.create({
          writer,
          post,
          depth,
          comment,
          groupNum,
          order,
        }),
      );
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 생성할 수 없습니다.',
      };
    }
  }

  async deleteIssueComment(
    user: User,
    { commentId }: DeleteIssueCommentInput,
  ): Promise<DeleteIssueCommentOutput> {
    try {
      const comment = await this.issueComments.findOne(commentId);
      if (!comment) {
        return {
          ok: false,
          error: '댓글을 찾을 수 없습니다.',
        };
      }
      if (user.role !== UserRole.CENSE) {
        if (comment.writer.id !== user.id) {
          return {
            ok: false,
            error: '본인이 작성한 댓글만 삭제할 수 있습니다.',
          };
        }
      }
      await this.issueComments.softDelete(commentId);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 삭제할 수 없습니다.',
      };
    }
  }

  async editIssueComment(
    user: User,
    { commentId, comment }: EditIssueCommentInput,
  ): Promise<EditIssueCommentOutput> {
    try {
      const getComment = await this.issueComments.findOne(commentId);
      if (!getComment) {
        return {
          ok: false,
          error: '댓글을 찾을 수 없습니다.',
        };
      }
      if (getComment.writerId !== user.id) {
        return {
          ok: false,
          error: '본인이 작성한 댓글만 수정할 수 있습니다.',
        };
      }
      if (!comment) {
        return {
          ok: false,
          error: '댓글 입력이 필요합니다.',
        };
      }
      await this.issueComments.save({
        id: commentId,
        comment,
      });
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 수정할 수 없습니다.',
      };
    }
  }
}
