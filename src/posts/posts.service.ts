import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateHomeNoticeInput,
  CreateHomeNoticeOutput,
} from './dtos/create-homeNotice.dto';
import {
  GetHomeNoticeInput,
  GetHomeNoticeOutput,
} from './dtos/get-homeNotice.dto';
import { HomeNotice } from './entities/home-notice.entity';

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
