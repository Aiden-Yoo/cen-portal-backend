import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AllWorkaroundsInput,
  AllWorkaroundsOutput,
} from '../workarounds/dtos/all-workarounds.dto';
import {
  CreateWorkaroundInput,
  CreateWorkaroundOutput,
} from './dtos/create-workaround.dto';
import {
  CreateWorkaroundCommentInput,
  CreateWorkaroundCommentOutput,
} from './dtos/create-workaroundComment.dto';
import {
  DeleteWorkaroundInput,
  DeleteWorkaroundOutput,
} from './dtos/delete-workaround.dto';
import {
  DeleteWorkaroundCommentInput,
  DeleteWorkaroundCommentOutput,
} from './dtos/delete-workaroundComment.dto';
import {
  EditWorkaroundInput,
  EditWorkaroundOutput,
} from './dtos/edit-workaround.dto';
import {
  EditWorkaroundCommentInput,
  EditWorkaroundCommentOutput,
} from './dtos/edit-workaroundComment.dto';
import {
  GetWorkaroundInput,
  GetWorkaroundOutput,
} from './dtos/get-workaround.dto';
import {
  GetWorkaroundCommentInput,
  GetWorkaroundCommentOutput,
} from './dtos/get-workaroundComments.dto';
import { WorkaroundComments } from './entities/workaround-comments.entity';
import { WorkaroundFiles } from './entities/workaround-files.entity';
import { Workarounds } from './entities/workarounds.entity';

@Injectable()
export class WorkaroundService {
  constructor(
    @InjectRepository(Workarounds)
    private readonly workarounds: Repository<Workarounds>,
    @InjectRepository(WorkaroundComments)
    private readonly workaroundComments: Repository<WorkaroundComments>,
    @InjectRepository(WorkaroundFiles)
    private readonly workaroundFiles: Repository<WorkaroundFiles>,
  ) {}

  canWriter(user: User, workaround: Workarounds): boolean {
    let canSee = false;
    if (user.role === UserRole.CENSE || workaround.writerId === user.id) {
      canSee = true;
    }
    return canSee;
  }

  canCompany(user: User, workaround: Workarounds): boolean {
    let canSee = false;
    if (
      user.role === UserRole.CENSE ||
      workaround.writer.company === user.company
    ) {
      canSee = true;
    }
    return canSee;
  }

  async allWorkarounds(
    user: User,
    { page, take }: AllWorkaroundsInput,
  ): Promise<AllWorkaroundsOutput> {
    try {
      let workarounds: Workarounds[];
      let totalResults: number;
      // if (user.role === UserRole.CENSE) {
      [workarounds, totalResults] = await this.workarounds.findAndCount({
        // where: {
        //   locked: false,
        // },
        skip: (page - 1) * take,
        take,
        order: { id: 'DESC' },
        relations: ['writer', 'files'],
      });
      // }
      // else {
      //   [workarounds, totalResults] = await this.workarounds.findAndCount({
      //     where: {
      //       // locked: false,
      //       writer: user,
      //     },
      //     skip: (page - 1) * take,
      //     take,
      //     order: { id: 'DESC' },
      //     relations: ['writer', 'files'],
      //   });
      // }
      return {
        ok: true,
        workarounds,
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

  async commentsNum(workarounds: Workarounds): Promise<number> {
    return this.workaroundComments.count({
      where: {
        post: workarounds,
      },
    });
  }

  async getWorkaround(
    user: User,
    { id: workaroundId }: GetWorkaroundInput,
  ): Promise<GetWorkaroundOutput> {
    try {
      const workaround = await this.workarounds.findOne(workaroundId, {
        relations: ['writer', 'files'],
      });
      const comment = await this.workaroundComments.find({
        where: {
          post: workaround,
        },
        relations: ['writer'],
        withDeleted: false,
      });
      if (!workaround) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      // if (!this.canCompany(user, workaround) || user.role !== UserRole.CENSE) {
      //   return {
      //     ok: false,
      //     error: '소속 포스트만 볼 수 있습니다.',
      //   };
      // }
      if (comment) {
        workaround.comment = comment;
      }
      return {
        ok: true,
        workaround,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 불러올 수 없습니다.',
      };
    }
  }

  async createWorkaround(
    writer: User,
    createWorkaroundInput: CreateWorkaroundInput,
  ): Promise<CreateWorkaroundOutput> {
    try {
      const workaround = await this.workarounds.save(
        this.workarounds.create({
          writer,
          ...createWorkaroundInput,
        }),
      );
      if (createWorkaroundInput.files.length !== 0) {
        createWorkaroundInput.files.map(async file => {
          console.log(file);
          await this.workaroundFiles.save(
            this.workaroundFiles.create({
              workaround,
              path: file.path,
            }),
          );
        });
      }

      return {
        workaround,
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 생성할 수 없습니다.',
      };
    }
  }

  async deleteWorkaround(
    user: User,
    { workaroundId }: DeleteWorkaroundInput,
  ): Promise<DeleteWorkaroundOutput> {
    try {
      const workaround = await this.workarounds.findOne(workaroundId);
      if (!workaround) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (user.role !== UserRole.CENSE) {
        if (workaround.writerId !== user.id) {
          return {
            ok: false,
            error: '본인이 작성한 포스트만 삭제할 수 있습니다.',
          };
        }
      }
      await this.workarounds.softDelete(workaroundId);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '포스트를 삭제할 수 없습니다.',
      };
    }
  }

  async editWorkaround(
    user: User,
    { workaroundId, content, files, kind, locked, title }: EditWorkaroundInput,
  ): Promise<EditWorkaroundOutput> {
    try {
      const workaround = await this.workarounds.findOne(workaroundId);
      if (!workaround) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (!this.canWriter(user, workaround)) {
        return {
          ok: false,
          error: '작성자만 수정할 수 있습니다.',
        };
      }
      if (files) {
        await this.workaroundFiles.delete({ workaround });
        files.map(async file => {
          await this.workaroundFiles.save(
            this.workaroundFiles.create({
              workaround,
              path: file.path,
            }),
          );
        });
      }
      await this.workarounds.save({
        id: workaroundId,
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
export class WorkaroundCommentService {
  constructor(
    @InjectRepository(WorkaroundComments)
    private readonly workaroundComments: Repository<WorkaroundComments>,
    @InjectRepository(Workarounds)
    private readonly workarounds: Repository<Workarounds>,
  ) {}

  async getWorkaroundComment({
    workaroundId,
    take,
    page,
  }: GetWorkaroundCommentInput): Promise<GetWorkaroundCommentOutput> {
    try {
      const workaround = await this.workarounds.findOne(workaroundId);
      if (!workaround) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      const [
        comments,
        totalResults,
      ] = await this.workaroundComments.findAndCount({
        where: {
          post: workaround,
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

  async createWorkaroundComment(
    writer: User,
    {
      workaroundId,
      depth,
      comment,
      groupNum,
      order,
    }: CreateWorkaroundCommentInput,
  ): Promise<CreateWorkaroundCommentOutput> {
    // workaroundId,comment - 필수
    // order - 자동
    // groupNum - 선택. 없으면(댓) 생성, 있으면(대댓) order+1,
    // depth - 선택. 대댓 시 지정
    try {
      const post = await this.workarounds.findOne(workaroundId);
      if (!post) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (groupNum) {
        // if groupNum exist, order + 1
        const group = await this.workaroundComments.findOne({
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
          const equalDepth = await this.workaroundComments.findOne({
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
        const lastGroup = await this.workaroundComments.findOne({
          order: { groupNum: 'DESC' },
        });
        if (!lastGroup) {
          groupNum = 1;
        } else if (lastGroup.groupNum !== 1) {
          groupNum = lastGroup.groupNum + 1;
        }
      }

      await this.workaroundComments.save(
        this.workaroundComments.create({
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
      console.log(e);
      return {
        ok: false,
        error: '댓글을 생성할 수 없습니다.',
      };
    }
  }

  async deleteWorkaroundComment(
    user: User,
    { commentId }: DeleteWorkaroundCommentInput,
  ): Promise<DeleteWorkaroundCommentOutput> {
    try {
      const comment = await this.workaroundComments.findOne(commentId);
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
      await this.workaroundComments.softDelete(commentId);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '댓글을 삭제할 수 없습니다.',
      };
    }
  }

  async editWorkaroundComment(
    user: User,
    { commentId, comment }: EditWorkaroundCommentInput,
  ): Promise<EditWorkaroundCommentOutput> {
    try {
      const getComment = await this.workaroundComments.findOne(commentId);
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
      await this.workaroundComments.save({
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
