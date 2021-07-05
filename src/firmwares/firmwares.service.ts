import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AllFirmwaresInput,
  AllFirmwaresOutput,
} from '../firmwares/dtos/all-firmwares.dto';
import {
  CreateFirmwareInput,
  CreateFirmwareOutput,
} from './dtos/create-firmware.dto';
import {
  DeleteFirmwareInput,
  DeleteFirmwareOutput,
} from './dtos/delete-firmware.dto';
import {
  EditFirmwareInput,
  EditFirmwareOutput,
} from './dtos/edit-firmware.dto';
import { GetFirmwareInput, GetFirmwareOutput } from './dtos/get-firmware.dto';
import { FirmwareFiles } from './entities/firmware-files.entity';
import { Firmwares } from './entities/firmwares.entity';

@Injectable()
export class FirmwareService {
  constructor(
    @InjectRepository(Firmwares)
    private readonly firmwares: Repository<Firmwares>,
    @InjectRepository(FirmwareFiles)
    private readonly firmwareFiles: Repository<FirmwareFiles>,
  ) {}

  canWriter(user: User, firmware: Firmwares): boolean {
    let canSee = false;
    if (user.role === UserRole.CENSE || firmware.writerId === user.id) {
      canSee = true;
    }
    return canSee;
  }

  canCompany(user: User, firmware: Firmwares): boolean {
    let canSee = false;
    if (
      user.role === UserRole.CENSE ||
      firmware.writer.company === user.company
    ) {
      canSee = true;
    }
    return canSee;
  }

  async allFirmwares(
    user: User,
    { page, take }: AllFirmwaresInput,
  ): Promise<AllFirmwaresOutput> {
    try {
      let firmwares: Firmwares[];
      let totalResults: number;
      if (user.role === UserRole.CENSE) {
        [firmwares, totalResults] = await this.firmwares.findAndCount({
          // where: {
          //   locked: false,
          // },
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['writer', 'files'],
        });
      } else {
        [firmwares, totalResults] = await this.firmwares.findAndCount({
          // where: {
          // locked: false,
          // writer: user,
          // },
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['writer', 'files'],
        });
      }
      return {
        ok: true,
        firmwares,
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

  async getFirmware(
    user: User,
    { id: firmwareId }: GetFirmwareInput,
  ): Promise<GetFirmwareOutput> {
    try {
      const firmware = await this.firmwares.findOne(firmwareId, {
        relations: ['writer', 'files'],
      });
      if (!firmware) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      // if (!this.canCompany(user, firmware) || user.role !== UserRole.CENSE) {
      //   return {
      //     ok: false,
      //     error: '소속 포스트만 볼 수 있습니다.',
      //   };
      // }
      return {
        ok: true,
        firmware,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 불러올 수 없습니다.',
      };
    }
  }

  async createFirmware(
    writer: User,
    createFirmwareInput: CreateFirmwareInput,
  ): Promise<CreateFirmwareOutput> {
    try {
      const firmware = await this.firmwares.save(
        this.firmwares.create({
          writer,
          ...createFirmwareInput,
        }),
      );
      if (createFirmwareInput.files.length !== 0) {
        createFirmwareInput.files.map(async file => {
          console.log(file);
          await this.firmwareFiles.save(
            this.firmwareFiles.create({
              firmware,
              path: file.path,
            }),
          );
        });
      }

      return {
        firmware,
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 생성할 수 없습니다.',
      };
    }
  }

  async deleteFirmware(
    user: User,
    { firmwareId }: DeleteFirmwareInput,
  ): Promise<DeleteFirmwareOutput> {
    try {
      const firmware = await this.firmwares.findOne(firmwareId);
      if (!firmware) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (user.role !== UserRole.CENSE) {
        if (firmware.writerId !== user.id) {
          return {
            ok: false,
            error: '본인이 작성한 포스트만 삭제할 수 있습니다.',
          };
        }
      }
      await this.firmwares.softDelete(firmwareId);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '포스트를 삭제할 수 없습니다.',
      };
    }
  }

  async editFirmware(
    user: User,
    { firmwareId, content, files, kind, locked, title }: EditFirmwareInput,
  ): Promise<EditFirmwareOutput> {
    try {
      const firmware = await this.firmwares.findOne(firmwareId);
      if (!firmware) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (!this.canWriter(user, firmware)) {
        return {
          ok: false,
          error: '작성자만 수정할 수 있습니다.',
        };
      }
      if (files) {
        await this.firmwareFiles.delete({ firmware });
        files.map(async file => {
          await this.firmwareFiles.save(
            this.firmwareFiles.create({
              firmware,
              path: file.path,
            }),
          );
        });
      }
      await this.firmwares.save({
        id: firmwareId,
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
