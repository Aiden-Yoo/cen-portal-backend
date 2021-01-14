import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePartnerInput,
  CreatePartnerOutput,
} from './dtos/create-partner.dto';
import {
  DeletePartnerInput,
  DeletePartnerOutput,
} from './dtos/delete-partner.dto';
import { EditPartnerInput, EditPartnerOutput } from './dtos/edit-partner.dto';
import { Contact } from './entities/contact.entity';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partners: Repository<Partner>,
    @InjectRepository(Contact)
    private readonly contact: Repository<Contact>,
  ) {}

  async createPartner({
    name,
    address,
    zip,
  }: CreatePartnerInput): Promise<CreatePartnerOutput> {
    try {
      const exists = await this.partners.findOne({ name });
      if (exists) {
        return {
          ok: false,
          error: '이미 존재합니다.',
        };
      }
      await this.partners.save(this.partners.create({ name, address, zip }));
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

  async editPartner(
    editPartnerInput: EditPartnerInput,
  ): Promise<EditPartnerOutput> {
    try {
      const partner = await this.partners.findOne(editPartnerInput.partnerId);
      if (!partner) {
        return {
          ok: false,
          error: '파트너를 찾지 못했습니다.',
        };
      }
      await this.partners.save([
        {
          id: editPartnerInput.partnerId,
          ...editPartnerInput,
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

  async deletePartner({
    partnerId,
  }: DeletePartnerInput): Promise<DeletePartnerOutput> {
    try {
      const partner = await this.partners.findOne(partnerId);
      if (!partner) {
        return {
          ok: false,
          error: '파트너를 찾지 못했습니다.',
        };
      }
      await this.partners.delete(partnerId);
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
