import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw, Not, ILike, In } from 'typeorm';
import { CreateDemoInput, CreateDemoOutput } from './dtos/create-demo.dto';
import { DeleteDemoInput, DeleteDemoOutput } from './dtos/delete-demo.dto';
import { EditDemoInput, EditDemoOutput } from './dtos/edit-demo.dto';
import { GetDemosInput, GetDemosOutput } from './dtos/get-demos.dto';
import { Demo, DemoStatus } from './entities/demo.entity';

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(Demo)
    private readonly demos: Repository<Demo>,
  ) {}

  async createDemo(
    createDemoInput: CreateDemoInput,
  ): Promise<CreateDemoOutput> {
    try {
      await this.demos.save(this.demos.create(createDemoInput));
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '생성할 수 없습니다.',
      };
    }
  }

  async editDemo(editDemoInput: EditDemoInput): Promise<EditDemoOutput> {
    try {
      const demo = await this.demos.findOne(editDemoInput.id);
      if (!demo) {
        return {
          ok: false,
          error: '대상을 찾지 못했습니다.',
        };
      }
      await this.demos.save({
        id: editDemoInput.id,
        ...editDemoInput,
      });
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '변경할 수 없습니다.',
      };
    }
  }

  async deleteDemo({ id }: DeleteDemoInput): Promise<DeleteDemoOutput> {
    try {
      const demo = await this.demos.findOne(id);
      if (!demo) {
        return {
          ok: false,
          error: '대상을 찾지 못했습니다.',
        };
      }
      await this.demos.delete(id);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '삭제할 수 없습니다.',
      };
    }
  }

  async getDemos({
    page,
    take,
    status,
    searchTerm,
  }: GetDemosInput): Promise<GetDemosOutput> {
    try {
      const [demos, totalResults] = await this.demos.findAndCount({
        skip: (page - 1) * take,
        take,
        order: { createAt: 'DESC' },
        where: [
          {
            ...(status === DemoStatus.Completed && {
              status: In([DemoStatus.Return, DemoStatus.Sold, DemoStatus.Loss]),
            }),
            ...(status === DemoStatus.Notcompleted && {
              status: In([DemoStatus.Etc, DemoStatus.Release]),
            }),
            projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
          {
            ...(status === DemoStatus.Completed && {
              status: In([DemoStatus.Return, DemoStatus.Sold, DemoStatus.Loss]),
            }),
            ...(status === DemoStatus.Notcompleted && {
              status: In([DemoStatus.Etc, DemoStatus.Release]),
            }),
            serialNumber: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
          {
            ...(status === DemoStatus.Completed && {
              status: In([DemoStatus.Return, DemoStatus.Sold, DemoStatus.Loss]),
            }),
            ...(status === DemoStatus.Notcompleted && {
              status: In([DemoStatus.Etc, DemoStatus.Release]),
            }),
            partner: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
        ],
      });
      return {
        ok: true,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
        demos,
      };
    } catch (e) {
      return {
        ok: false,
        error: '불러올 수 없습니다.',
      };
    }
  }
}
