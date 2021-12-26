import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Part } from 'src/devices/entities/part.entity';
import { MailService } from 'src/mail/mail.service';
import { Partner } from 'src/partners/entities/partner.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import {
  Repository,
  Raw,
  Not,
  ILike,
  Between,
  MoreThan,
  LessThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  In,
} from 'typeorm';
import {
  CreateMaintenanceInput,
  CreateMaintenanceOutput,
} from './dtos/create-maintenance.dto';
import {
  DeleteMaintenanceInput,
  DeleteMaintenanceOutput,
} from './dtos/delete-maintenance.dto';
import {
  EditMaintenanceItemInfoInput,
  EditMaintenanceItemInfoOutput,
} from './dtos/edit-maintenanceItem.dto';
import {
  EditMaintenanceInput,
  EditMaintenanceOutput,
} from './dtos/edit-maintenance.dto';
import {
  GetMaintenanceInput,
  GetMaintenanceOutput,
} from './dtos/get-maintenance.dto';
import {
  GetMaintenanceItemsInput,
  GetMaintenanceItemsOutput,
} from './dtos/get-maintenanceItems.dto';
import {
  GetMaintenancesInput,
  GetMaintenancesOutput,
} from './dtos/get-maintenances.dto';
import { MaintenanceItemInfo } from './entities/maintenance-itemInfo.entity';
import { MaintenanceItem } from './entities/maintenance-item.entity';
import { Maintenance } from './entities/maintenance.entity';
import { addYears, subYears } from 'date-fns';

const AfterDate = (date: Date) => Between(date, addYears(date, 100));
const BeforeDate = (date: Date) => Between(subYears(date, 100), date);

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenances: Repository<Maintenance>,
    @InjectRepository(MaintenanceItem)
    private readonly maintenanceItems: Repository<MaintenanceItem>,
    @InjectRepository(MaintenanceItemInfo)
    private readonly itemInfos: Repository<MaintenanceItemInfo>,
    @InjectRepository(Partner)
    private readonly partners: Repository<Partner>,
    @InjectRepository(Bundle)
    private readonly bundles: Repository<Bundle>,
    @InjectRepository(Part)
    private readonly parts: Repository<Part>,
  ) {}

  async createMaintenance(
    writer: User,
    createMaintenanceInput: CreateMaintenanceInput,
  ): Promise<CreateMaintenanceOutput> {
    try {
      const distPartner = await this.partners.findOne(
        createMaintenanceInput.distPartnerId,
      );
      if (!distPartner) {
        return {
          ok: false,
          error: '파트너를 찾을 수 없습니다.',
        };
      }
      const today = new Date()
        .toISOString()
        .replace(/-/g, '')
        .substring(2, 8);
      const [_, totalToday] = await this.maintenances.findAndCount({
        where: {
          contractNo: ILike(`%${today}%`),
        },
      });

      let maintenance = await this.maintenances.save(
        this.maintenances.create({
          ...createMaintenanceInput,
          contractNo: `CEN-SVC-${today}-${
            totalToday + 1 < 10 ? '0' + (totalToday + 1) : totalToday + 1
          }`,
          writer,
          distPartner,
          items: null,
        }),
      );
      const maintenanceItems: MaintenanceItem[] = [];
      const itemInfo: MaintenanceItemInfo[] = [];
      for (const item of createMaintenanceInput.items) {
        const bundle = await this.bundles.findOne(item.bundleId);
        if (!bundle) {
          return {
            ok: false,
            error: '번들을 찾을 수 없습니다.',
          };
        }
        // for maintenance-item
        const maintenanceItem = await this.maintenanceItems.save(
          this.maintenanceItems.create({
            bundle,
            num: item.num,
            maintenance,
          }),
        );
        maintenanceItems.push(maintenanceItem);
      }
      // for maintenance
      const findMaintenance = await this.maintenances.findOne(maintenance.id, {
        relations: ['writer', 'distPartner'],
      });
      maintenance = await this.maintenances.save({
        ...findMaintenance,
        items: maintenanceItems,
      });
      // for itme-info
      for (const maintenanceItem of maintenanceItems) {
        // maintenanceItem.num // number of bundle
        // maintenanceItem.bundle.id // bundle id
        const { parts } = await this.bundles.findOne(
          maintenanceItem.bundle.id,
          {
            relations: ['parts', 'parts.part'],
          },
        );
        for (const partlist of parts) {
          // console.log(partlist);
          // console.log(
          //   partlist.part.name + ': ' + partlist.num + 'x' + maintenanceItem.num,
          // );
          for (
            let count = 0;
            count < partlist.num * maintenanceItem.num;
            count++
          ) {
            await this.itemInfos.save(
              this.itemInfos.create({
                name: partlist.part.name,
                maintenance,
              }),
            );
          }
        }
      }
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유지보수를 생성할 수 없습니다.',
      };
    }
  }

  canSeeMaintenance(user: User, maintenance: Maintenance): boolean {
    let canSee = true;
    if (user.role === UserRole.CEN && maintenance.writerId !== user.id) {
      canSee = false;
    } else if (
      user.role === UserRole.Partner &&
      maintenance.distPartner.name === user.company
    ) {
      canSee = true;
    }
    return canSee;
  }

  async editMaintenance(
    user: User,
    editMaintenanceInput: EditMaintenanceInput,
  ): Promise<EditMaintenanceOutput> {
    try {
      const maintenance = await this.maintenances.findOne(
        editMaintenanceInput.id,
        {
          relations: ['distPartner'],
        },
      );
      if (!maintenance) {
        return {
          ok: false,
          error: '유지보수를 찾을 수 없습니다.',
        };
      }
      if (!this.canSeeMaintenance(user, maintenance)) {
        return {
          ok: false,
          error: '작성자만 볼 수 있습니다.',
        };
      }
      let canEdit = true;
      if (user.role === UserRole.CEN) {
        if (maintenance.writer !== user) {
          canEdit = false;
        }
      }
      if (user.role === UserRole.Partner) {
        return {
          ok: false,
          error: `권한이 없습니다.`,
        };
      }
      if (!canEdit) {
        return {
          ok: false,
          error: `본인이 작성한 글만 수정할 수 있습니다.`,
        };
      }
      await this.maintenances.save([
        {
          id: editMaintenanceInput.id,
          ...editMaintenanceInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유지보수를 수정할 수 없습니다.',
      };
    }
  }

  async deleteMaintenance(
    user: User,
    { maintenanceId }: DeleteMaintenanceInput,
  ): Promise<DeleteMaintenanceOutput> {
    try {
      const maintenance = await this.maintenances.findOne(maintenanceId, {
        relations: ['distPartner'],
      });
      if (!maintenance) {
        return {
          ok: false,
          error: '유지보수를 찾을 수 없습니다.',
        };
      }
      if (user.role === UserRole.CEN) {
        if (maintenance.writerId !== user.id) {
          return {
            ok: false,
            error: '다른 작성자의 유지보수입니다. 삭제할 수 없습니다.',
          };
        }
        return {
          ok: false,
          error:
            '유지보수를 삭제할 수 없습니다.\n출고취소 상태로 변경해주세요.',
        };
      }

      await this.maintenances.delete(maintenanceId);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유지보수를 삭제할 수 없습니다.',
      };
    }
  }

  async editMaintenanceItemInfo(
    editMaintenanceItemInfoInput: EditMaintenanceItemInfoInput,
  ): Promise<EditMaintenanceItemInfoOutput> {
    try {
      const maintenance = await this.itemInfos.findOne(
        editMaintenanceItemInfoInput.itemInfoId,
      );
      if (!maintenance) {
        return {
          ok: false,
          error: '해당 물품을 찾을 수 없습니다.',
        };
      }
      await this.itemInfos.save([
        {
          id: editMaintenanceItemInfoInput.itemInfoId,
          ...editMaintenanceItemInfoInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '물품 정보를 수정할 수 없습니다.',
      };
    }
  }

  async getMaintenances(
    user: User,
    { page, take, searchTerm, maintenanceStatus }: GetMaintenancesInput,
  ): Promise<GetMaintenancesOutput> {
    try {
      let maintenances: Maintenance[];
      let totalResults: number;
      const distPartner = await this.partners.findOne({
        where: {
          name: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
        },
      });
      const itemInfos = await this.itemInfos.find({
        where: {
          serialNumber: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
        },
      });
      const maintenanceIds = itemInfos.map(itemInfo => itemInfo.maintenanceId);

      // const today = new Date()
      //   .toISOString()
      //   .replace(/-/g, '')
      //   .substring(2, 8);
      // const [_, totalToday] = await this.maintenances.findAndCount({
      //   where: {
      //     contractNo: ILike(`%${today}%`),
      //   },
      // });
      // console.log(
      //   `${new Date()
      //     .toISOString()
      //     .replace(/-/g, '')
      //     .substring(2, 8)}`,
      //   totalToday,
      // );

      if (user.role === UserRole.CEN) {
        [maintenances, totalResults] = await this.maintenances.findAndCount({
          where: [
            {
              writer: user,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              writer: user,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              salesPerson: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              writer: user,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              description: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              writer: user,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              reqPartner: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              writer: user,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              distPartner,
            },
            {
              writer: user,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              ...(maintenanceIds && { id: In(maintenanceIds) }),
            },
          ],
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['writer', 'distPartner', 'items', 'items.bundle'],
        });
      } else if (user.role === UserRole.CENSE) {
        [maintenances, totalResults] = await this.maintenances.findAndCount({
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          where: [
            {
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              salesPerson: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              description: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              reqPartner: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              distPartner,
            },
            {
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              ...(maintenanceIds && { id: In(maintenanceIds) }),
            },
          ],
          relations: ['writer', 'distPartner', 'items', 'items.bundle'],
        });
      } else if (user.role === UserRole.Partner) {
        const partner = await this.partners.findOne({ name: user.company });
        if (!user.orderAuth) {
          return {
            ok: false,
            error: '권한이 없습니다. 관리자에게 문의해주세요.',
          };
        }
        if (!partner) {
          return {
            ok: false,
            error: '등록된 유지보수 내역이 없습니다.',
          };
        }
        [maintenances, totalResults] = await this.maintenances.findAndCount({
          where: [
            {
              partner,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              partner,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              salesPerson: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              partner,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              description: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              partner,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              reqPartner: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              partner,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              distPartner,
            },
            {
              partner,
              ...(maintenanceStatus === '계약중' && {
                endDate: AfterDate(new Date()),
              }),
              ...(maintenanceStatus === '계약만료' && {
                endDate: BeforeDate(new Date()),
              }),
              ...(maintenanceIds && { id: In(maintenanceIds) }),
            },
          ],
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['writer', 'distPartner', 'items', 'items.bundle'],
        });
      }
      return {
        ok: true,
        maintenances,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유지보수를 불러올 수 없습니다.',
      };
    }
  }

  async getMaintenance(
    user: User,
    { id: maintenanceId }: GetMaintenanceInput,
  ): Promise<GetMaintenanceOutput> {
    try {
      let maintenance: Maintenance;
      if (user.role === UserRole.Partner) {
        const partner = await this.partners.findOne({ name: user.company });
        if (!user.orderAuth) {
          return {
            ok: false,
            error: '권한이 없습니다. 관리자에게 문의해주세요.',
          };
        }
        if (!partner) {
          return {
            ok: false,
            error: '등록된 출고기록이 없습니다.',
          };
        }
        maintenance = await this.maintenances.findOne(maintenanceId, {
          where: {
            partner,
          },
          relations: [
            'writer',
            'distPartner',
            'items',
            'items.bundle',
            'maintenanceItemInfos',
          ],
        });
      }
      if (user.role !== UserRole.Partner) {
        maintenance = await this.maintenances.findOne(maintenanceId, {
          relations: [
            'writer',
            'distPartner',
            'items',
            'items.bundle',
            'maintenanceItemInfos',
          ],
        });
      }
      if (!maintenance) {
        return {
          ok: false,
          error: '존재하지 않는 출고요청서 입니다.',
        };
      }
      if (!this.canSeeMaintenance(user, maintenance)) {
        return {
          ok: false,
          error: '권한이 없습니다.',
        };
      }
      return {
        ok: true,
        maintenance,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유지보수를 불러올 수 없습니다.',
      };
    }
  }

  async getMaintenanceItems(
    user: User,
    { maintenanceId, page, take }: GetMaintenanceItemsInput,
  ): Promise<GetMaintenanceItemsOutput> {
    try {
      if (
        user.role === UserRole.CENSE ||
        user.role === UserRole.CEN ||
        user.role === UserRole.Partner
      ) {
        const [itemInfos, totalResults] = await this.itemInfos.findAndCount({
          where: {
            maintenance: maintenanceId,
          },
          skip: (page - 1) * take,
          take,
          order: { id: 'ASC' },
        });
        if (!itemInfos || itemInfos.length === 0) {
          return {
            ok: false,
            error: '제품 정보가 존재하지 않습니다.',
          };
        }
        return {
          ok: true,
          itemInfos,
          totalPages: Math.ceil(totalResults / take),
          totalResults,
        };
      }
    } catch (e) {
      return {
        ok: false,
        error: '제품 정보를 불러올 수 없습니다.',
      };
    }
  }

  async maintenanceStatus(maintenance: Maintenance): Promise<string> {
    if (maintenance.endDate < new Date()) return '계약만료';
    else return '계약중';
  }
}
