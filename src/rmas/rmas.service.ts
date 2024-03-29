import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In, IsNull, Not } from 'typeorm';
import { CreateRmaInput, CreateRmaOutput } from './dtos/create-rma.dto';
import { DeleteRmaInput, DeleteRmaOutput } from './dtos/delete-rma.dto';
import { EditRmaInput, EditRmaOutput } from './dtos/edit-rma.dto';
import { GetRmasInput, GetRmasOutput } from './dtos/get-rmas.dto';
import { Rma } from './entities/rma.entity';

@Injectable()
export class RmaService {
  constructor(
    @InjectRepository(Rma)
    private readonly rmas: Repository<Rma>,
  ) {}

  async createRma(createRmaInput: CreateRmaInput): Promise<CreateRmaOutput> {
    try {
      await this.rmas.save(this.rmas.create(createRmaInput));
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

  async editRma(editRmaInput: EditRmaInput): Promise<EditRmaOutput> {
    try {
      const rma = await this.rmas.findOne(editRmaInput.id);
      if (!rma) {
        return {
          ok: false,
          error: '대상을 찾지 못했습니다.',
        };
      }
      await this.rmas.save({
        id: editRmaInput.id,
        ...editRmaInput,
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

  async deleteRma({ id }: DeleteRmaInput): Promise<DeleteRmaOutput> {
    try {
      const rma = await this.rmas.findOne(id);
      if (!rma) {
        return {
          ok: false,
          error: '대상을 찾지 못했습니다.',
        };
      }
      await this.rmas.delete(id);
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

  async getRmas({
    page,
    take,
    rmaStatus,
    classification,
    searchTerm,
  }: GetRmasInput): Promise<GetRmasOutput> {
    try {
      const [rmas, totalResults] = await this.rmas.findAndCount({
        skip: (page - 1) * take,
        take,
        order: { createAt: 'DESC' },
        where: [
          {
            ...(rmaStatus === '선입고' && {
              returnDate: Not(IsNull()),
              deliverDate: IsNull(),
            }),
            ...(rmaStatus === '선출고' && {
              returnDate: IsNull(),
              deliverDate: Not(IsNull()),
            }),
            ...(rmaStatus === '완료' && {
              returnDate: Not(IsNull()),
              deliverDate: Not(IsNull()),
            }),
            ...(classification && { classification }),
            projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
          {
            ...(rmaStatus === '선입고' && {
              returnDate: Not(IsNull()),
              deliverDate: IsNull(),
            }),
            ...(rmaStatus === '선출고' && {
              returnDate: IsNull(),
              deliverDate: Not(IsNull()),
            }),
            ...(rmaStatus === '완료' && {
              returnDate: Not(IsNull()),
              deliverDate: Not(IsNull()),
            }),
            ...(classification && { classification }),
            returnSn: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
          {
            ...(rmaStatus === '선입고' && {
              returnDate: Not(IsNull()),
              deliverDate: IsNull(),
            }),
            ...(rmaStatus === '선출고' && {
              returnDate: IsNull(),
              deliverDate: Not(IsNull()),
            }),
            ...(rmaStatus === '완료' && {
              returnDate: Not(IsNull()),
              deliverDate: Not(IsNull()),
            }),
            ...(classification && { classification }),
            deliverSn: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
          {
            ...(rmaStatus === '선입고' && {
              returnDate: Not(IsNull()),
              deliverDate: IsNull(),
            }),
            ...(rmaStatus === '선출고' && {
              returnDate: IsNull(),
              deliverDate: Not(IsNull()),
            }),
            ...(rmaStatus === '완료' && {
              returnDate: Not(IsNull()),
              deliverDate: Not(IsNull()),
            }),
            ...(classification && { classification }),
            returnSrc: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
          {
            ...(rmaStatus === '선입고' && {
              returnDate: Not(IsNull()),
              deliverDate: IsNull(),
            }),
            ...(rmaStatus === '선출고' && {
              returnDate: IsNull(),
              deliverDate: Not(IsNull()),
            }),
            ...(rmaStatus === '완료' && {
              returnDate: Not(IsNull()),
              deliverDate: Not(IsNull()),
            }),
            ...(classification && { classification }),
            deliverDst: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
          {
            ...(rmaStatus === '선입고' && {
              returnDate: Not(IsNull()),
              deliverDate: IsNull(),
            }),
            ...(rmaStatus === '선출고' && {
              returnDate: IsNull(),
              deliverDate: Not(IsNull()),
            }),
            ...(rmaStatus === '완료' && {
              returnDate: Not(IsNull()),
              deliverDate: Not(IsNull()),
            }),
            ...(classification && { classification }),
            model: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
          },
        ],
      });
      return {
        ok: true,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
        rmas,
      };
    } catch (e) {
      return {
        ok: false,
        error: '불러올 수 없습니다.',
      };
    }
  }

  async rmaStatus(rma: Rma): Promise<string> {
    if (!rma.returnDate && !rma.deliverDate) return '임시';
    if (rma.returnDate && !rma.deliverDate) return '선입고';
    if (!rma.returnDate && rma.deliverDate) return '선출고';
    if (rma.returnDate && rma.deliverDate) return '완료';
  }
}
