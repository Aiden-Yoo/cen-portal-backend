import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateBundleInput,
  CreateBundleOutput,
} from './dtos/create-bundle.dto';
import { CreatePartInput, CreatePartOutput } from './dtos/create-part.dto';
import {
  DeleteBundleInput,
  DeleteBundleOutput,
} from './dtos/delete-bundle.dto';
import { DeletePartInput, DeletePartOutput } from './dtos/delete-part.dto';
import { EditBundleInput, EditBundleOutput } from './dtos/edit-bundle.dto';
import { EditPartInput, EditPartOutput } from './dtos/edit-part.dto';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundles: Repository<Bundle>,
    @InjectRepository(Part)
    private readonly parts: Repository<Part>,
  ) {}

  async createBundle({ name }: CreateBundleInput): Promise<CreateBundleOutput> {
    try {
      const exists = await this.bundles.findOne({ name });
      if (exists) {
        return {
          ok: false,
          error: '이미 존재합니다.',
        };
      }
      await this.bundles.save(this.bundles.create({ name }));
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

  async editBundle(
    editBundleInput: EditBundleInput,
  ): Promise<EditBundleOutput> {
    try {
      const bundle = await this.bundles.findOne(editBundleInput.bundleId);
      if (!bundle) {
        return {
          ok: false,
          error: '번들을 찾지 못했습니다.',
        };
      }
      await this.bundles.save({
        id: editBundleInput.bundleId,
        ...editBundleInput,
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

  async deleteBundle({
    bundleId,
  }: DeleteBundleInput): Promise<DeleteBundleOutput> {
    try {
      const bundle = await this.bundles.findOne(bundleId);
      if (!bundle) {
        return {
          ok: false,
          error: '번들을 찾지 못했습니다.',
        };
      }
      await this.bundles.delete(bundleId);
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

  async createPart(
    createPartInput: CreatePartInput,
  ): Promise<CreatePartOutput> {
    try {
      const bundle = await this.bundles.findOne(createPartInput.bundleId);
      if (!bundle) {
        return {
          ok: false,
          error: '번들을 찾을 수 없습니다.',
        };
      }
      await this.parts.save(this.parts.create({ ...createPartInput, bundle }));
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

  async editPart(editPartInput: EditPartInput): Promise<EditPartOutput> {
    try {
      const part = await this.parts.findOne(editPartInput.partId);
      if (!part) {
        return {
          ok: false,
          error: '부품을 찾지 못했습니다.',
        };
      }
      await this.parts.save({
        id: editPartInput.partId,
        ...editPartInput,
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

  async deletePart({ partId }: DeletePartInput): Promise<DeletePartOutput> {
    try {
      const part = await this.parts.findOne(partId);
      if (!part) {
        return {
          ok: false,
          error: '부품을 찾지 못했습니다.',
        };
      }
      await this.parts.delete(partId);
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
}
