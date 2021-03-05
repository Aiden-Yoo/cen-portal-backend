import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateHomeNoticeInput,
  CreateHomeNoticeOutput,
} from './dtos/create-homeNotice.dto';
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
        error: '포스트를 생성할 수 없습니다.',
      };
    }
  }
}
