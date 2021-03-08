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
  DeleteIssueInput,
  DeleteIssueOutput,
} from './dtos/issues/delete-issue.dto';
import { EditIssueInput, EditIssueOutput } from './dtos/issues/edit-issue.dto';
import { HomeNotice } from './entities/home-notice.entity';
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

  async allIssues({ page, take }: AllIssuesInput): Promise<AllIssuesOutput> {
    try {
      const [issues, totalResults] = await this.issues.findAndCount({
        where: {
          locked: false,
        },
        skip: (page - 1) * take,
        take,
        order: { id: 'ASC' },
        relations: ['writer', 'files'],
      });
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
