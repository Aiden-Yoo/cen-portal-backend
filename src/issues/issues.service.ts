import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Any, Equal, In, Not, Raw, Repository } from 'typeorm';
import { AllIssuesInput, AllIssuesOutput } from '../issues/dtos/all-issues.dto';
import { CreateIssueInput, CreateIssueOutput } from './dtos/create-issue.dto';
import {
  CreateIssueCommentInput,
  CreateIssueCommentOutput,
} from './dtos/create-issueComment.dto';
import { DeleteIssueInput, DeleteIssueOutput } from './dtos/delete-issue.dto';
import {
  DeleteIssueCommentInput,
  DeleteIssueCommentOutput,
} from './dtos/delete-issueComment.dto';
import { EditIssueInput, EditIssueOutput } from './dtos/edit-issue.dto';
import {
  EditIssueCommentInput,
  EditIssueCommentOutput,
} from './dtos/edit-issueComment.dto';
import { GetIssueInput, GetIssueOutput } from './dtos/get-issue.dto';
import {
  GetIssueCommentInput,
  GetIssueCommentOutput,
} from './dtos/get-issueComments.dto';
import { IssueComments } from './entities/issue-comments.entity';
import { IssueFiles } from './entities/issue-files.entity';
import { Issues } from './entities/issues.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issues)
    private readonly issues: Repository<Issues>,
    @InjectRepository(IssueComments)
    private readonly issueComments: Repository<IssueComments>,
    @InjectRepository(IssueFiles)
    private readonly issueFiles: Repository<IssueFiles>,
  ) {}

  canWriter(user: User, issue: Issues): boolean {
    let canSee = false;
    if (user.role === UserRole.CENSE || issue.writerId === user.id) {
      canSee = true;
    }
    return canSee;
  }

  canCompany(user: User, issue: Issues): boolean {
    let canSee = false;
    if (user.role === UserRole.CENSE || issue.writer.company === user.company) {
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
            // locked: false,
          },
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['writer', 'files'],
        });
      } else {
        [issues, totalResults] = await this.issues
          .createQueryBuilder('issues')
          .leftJoinAndSelect('issues.writer', 'writer')
          .leftJoinAndSelect('issues.files', 'files')
          .where('writer.company = :company', { company: user.company })
          .orderBy('issues.id', 'DESC')
          .skip((page - 1) * take)
          .take(take)
          .getManyAndCount();
      }
      return {
        ok: true,
        issues,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '포스트를 불러올 수 없습니다.',
      };
    }
  }

  async commentsNum(issues: Issues): Promise<number> {
    return this.issueComments.count({
      where: {
        post: issues,
      },
    });
  }

  async getIssue(
    user: User,
    { id: issueId }: GetIssueInput,
  ): Promise<GetIssueOutput> {
    try {
      const issue = await this.issues.findOne(issueId, {
        relations: ['writer', 'files'],
      });
      const comment = await this.issueComments.find({
        where: {
          post: issue,
        },
        relations: ['writer'],
        withDeleted: false,
      });
      if (!issue) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (!this.canCompany(user, issue)) {
        return {
          ok: false,
          error: '소속 포스트만 볼 수 있습니다.',
        };
      }
      if (comment) {
        issue.comment = comment;
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
      const issue = await this.issues.save(
        this.issues.create({
          writer,
          ...createIssueInput,
        }),
      );
      if (createIssueInput.files.length !== 0) {
        createIssueInput.files.map(async file => {
          console.log(file);
          await this.issueFiles.save(
            this.issueFiles.create({
              issue,
              path: file.path,
            }),
          );
        });
      }

      return {
        issue,
        ok: true,
      };
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
    { issueId, content, files, kind, locked, title }: EditIssueInput,
  ): Promise<EditIssueOutput> {
    try {
      const issue = await this.issues.findOne(issueId);
      if (!issue) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (!this.canWriter(user, issue)) {
        return {
          ok: false,
          error: '작성자만 수정할 수 있습니다.',
        };
      }
      if (files) {
        await this.issueFiles.delete({ issue });
        files.map(async file => {
          await this.issueFiles.save(
            this.issueFiles.create({
              issue,
              path: file.path,
            }),
          );
        });
      }
      await this.issues.save({
        id: issueId,
        content,
        kind,
        locked,
        title,
      });
      return { ok: true };
    } catch (e) {
      console.log(e);
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
    private readonly mailService: MailService,
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
        if (!lastGroup) {
          groupNum = 1;
        } else if (lastGroup.groupNum !== 1) {
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
      this.mailService.notifyNewReply(writer, post, comment);
      return { ok: true };
    } catch (e) {
      console.log(e);
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
      if (!comment || comment === '') {
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
