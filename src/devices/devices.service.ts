import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { AllBundlesInput, AllBundlesOutput } from './dtos/all-bundles.dto';
import { AllPartsInput, AllPartsOutput } from './dtos/all-parts.dto';
import { BundleInput, BundleOutput } from './dtos/bundle.dto';
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
import { PartInput, PartOutput } from './dtos/part.dto';
import {
  SearchBundleInput,
  SearchBundleOutput,
} from './dtos/search-bundle.dto';
import { SearchPartInput, SearchPartOutput } from './dtos/search-part.dto';
import { BundleItem } from './entities/bundle-item.entity';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundles: Repository<Bundle>,
    @InjectRepository(BundleItem)
    private readonly bundleItems: Repository<BundleItem>,
    @InjectRepository(Part)
    private readonly parts: Repository<Part>,
  ) {}

  async createBundle(
    createBundleInput: CreateBundleInput,
  ): Promise<CreateBundleOutput> {
    try {
      const bundleItems: BundleItem[] = [];
      for (const onePart of createBundleInput.parts) {
        const part = await this.parts.findOne(onePart.partId);
        if (!part) {
          return {
            ok: false,
            error: '부품을 찾을 수 없습니다.',
          };
        }
        // for bundle-item
        const bundleItem = await this.bundleItems.save(
          this.bundleItems.create({
            part,
            num: onePart.num,
          }),
        );
        bundleItems.push(bundleItem);
      }
      // for bundle
      await this.bundles.save(
        this.bundles.create({
          ...createBundleInput,
          parts: bundleItems,
        }),
      );

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

  async allBundles({ page, take }: AllBundlesInput): Promise<AllBundlesOutput> {
    try {
      const [bundles, totalResults] = await this.bundles.findAndCount({
        skip: (page - 1) * take,
        take,
        relations: ['parts', 'parts.part'],
      });
      return {
        ok: true,
        bundles,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      return {
        ok: false,
        error: '번들 정보를 불러올 수 없습니다.',
      };
    }
  }

  async findBundleById({ bundleId }: BundleInput): Promise<BundleOutput> {
    try {
      const bundle = await this.bundles.findOne(bundleId, {
        relations: ['parts', 'parts.part'],
      });
      if (!bundle) {
        return {
          ok: false,
          error: '해당 번들이 없습니다.',
        };
      }
      return {
        ok: true,
        bundle,
      };
    } catch (e) {
      return {
        ok: false,
        error: '번들 정보를 찾을 수 없습니다.',
      };
    }
  }

  async searchBundleByName({
    query,
    page,
    take,
  }: SearchBundleInput): Promise<SearchBundleOutput> {
    try {
      const [bundles, totalResults] = await this.bundles.findAndCount({
        where: {
          name: Raw(name => `${name} ILIKE '%${query}%'`),
        },
        skip: (page - 1) * take,
        take,
        relations: ['parts', 'parts.part'],
      });
      return {
        ok: true,
        bundles,
        totalResults,
        totalPages: Math.ceil(totalResults / take),
      };
    } catch (e) {
      return {
        ok: false,
        error: '번들을 찾을 수 없습니다.',
      };
    }
  }

  async createPart({
    name,
    series,
    description,
  }: CreatePartInput): Promise<CreatePartOutput> {
    try {
      const exists = await this.parts.findOne({ name });
      if (exists) {
        return {
          ok: false,
          error: '이미 존재합니다.',
        };
      }
      await this.parts.save(this.parts.create({ name, series, description }));
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
          error: '부품을 찾을 수 없습니다.',
        };
      }
      await this.parts.save([
        {
          id: editPartInput.partId,
          ...editPartInput,
        },
      ]);
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

  async allParts({ page, take }: AllPartsInput): Promise<AllPartsOutput> {
    try {
      const [parts, totalResults] = await this.parts.findAndCount({
        skip: (page - 1) * take,
        take,
      });
      return {
        ok: true,
        parts,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      return {
        ok: false,
        error: '부품 정보를 불러올 수 없습니다.',
      };
    }
  }

  async findPartById({ partId }: PartInput): Promise<PartOutput> {
    try {
      const part = await this.parts.findOne(partId);
      if (!part) {
        return {
          ok: false,
          error: '해당 부품이 없습니다.',
        };
      }
      return {
        ok: true,
        part,
      };
    } catch (e) {
      return {
        ok: false,
        error: '부품 정보를 찾을 수 없습니다.',
      };
    }
  }

  async searchPartByName({
    query,
    page,
    take,
  }: SearchPartInput): Promise<SearchPartOutput> {
    try {
      const [parts, totalResults] = await this.parts.findAndCount({
        where: {
          name: Raw(name => `${name} ILIKE '%${query}%'`),
        },
        skip: (page - 1) * take,
        take,
      });
      return {
        ok: true,
        parts,
        totalResults,
        totalPages: Math.ceil(totalResults / take),
      };
    } catch (e) {
      return {
        ok: false,
        error: '부품을 찾을 수 없습니다.',
      };
    }
  }
}
