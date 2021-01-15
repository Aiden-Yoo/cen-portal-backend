import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllContactsOutput } from './dtos/all-contacts.dto';
import { AllPartnersInput, AllPartnersOutput } from './dtos/all-partners.dto';
import {
  CreateContactInput,
  CreateContactOutput,
} from './dtos/create-contact.dto';
import {
  CreatePartnerInput,
  CreatePartnerOutput,
} from './dtos/create-partner.dto';
import {
  DeleteContactInput,
  DeleteContactOutput,
} from './dtos/delete-contact.dto';
import {
  DeletePartnerInput,
  DeletePartnerOutput,
} from './dtos/delete-partner.dto';
import { EditContactInput, EditContactOutput } from './dtos/edit-contact.dto';
import { EditPartnerInput, EditPartnerOutput } from './dtos/edit-partner.dto';
import { PartnerInput, PartnerOutput } from './dtos/partner.dto';
import { Contact } from './entities/contact.entity';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partners: Repository<Partner>,
    @InjectRepository(Contact)
    private readonly contacts: Repository<Contact>,
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
      await this.partners.save({
        id: editPartnerInput.partnerId,
        ...editPartnerInput,
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

  async allPartners({
    page,
    take,
  }: AllPartnersInput): Promise<AllPartnersOutput> {
    try {
      if (take !== 25 && take !== 50 && take !== 75 && take !== 100) {
        return {
          ok: false,
          error: '잘못된 변수 입니다.',
        };
      }
      const [partners, totalResults] = await this.partners.findAndCount({
        skip: (page - 1) * take,
        take,
        relations: ['contacts'],
      });
      return {
        ok: true,
        partners,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      return {
        ok: false,
        error: '파트너 정보를 불러올 수 없습니다.',
      };
    }
  }

  async countContacts(partner: Partner): Promise<number> {
    return this.contacts.count({ partner });
  }

  async findPartnerById({ partnerId }: PartnerInput): Promise<PartnerOutput> {
    try {
      const partner = await this.partners.findOne(partnerId, {
        relations: ['contacts'],
      });
      if (!partner) {
        return {
          ok: false,
          error: '해당 파트너가 없습니다.',
        };
      }
      return {
        ok: true,
        partner,
      };
    } catch (e) {
      return {
        ok: false,
        error: '파트너 정보를 찾을 수 없습니다.',
      };
    }
  }

  async createContact(
    createContactInput: CreateContactInput,
  ): Promise<CreateContactOutput> {
    try {
      const partner = await this.partners.findOne(createContactInput.partnerId);
      if (!partner) {
        return {
          ok: false,
          error: '파트너를 찾을 수 없습니다.',
        };
      }
      await this.contacts.save(
        this.contacts.create({ ...createContactInput, partner }),
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

  async editContact(
    editContactInput: EditContactInput,
  ): Promise<EditContactOutput> {
    try {
      const contact = await this.contacts.findOne(editContactInput.contactId);
      if (!contact) {
        return {
          ok: false,
          error: '연락처를 찾지 못했습니다.',
        };
      }
      await this.contacts.save({
        id: editContactInput.contactId,
        ...editContactInput,
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

  async deleteContact({
    contactId,
  }: DeleteContactInput): Promise<DeleteContactOutput> {
    try {
      const contact = await this.contacts.findOne(contactId);
      if (!contact) {
        return {
          ok: false,
          error: '연락처를 찾지 못했습니다.',
        };
      }
      await this.contacts.delete(contactId);
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

  async allContacts(): Promise<AllContactsOutput> {
    try {
      const contacts = await this.contacts.find();
      return {
        ok: true,
        contacts,
      };
    } catch (e) {
      return {
        ok: false,
        error: '연락처 정보를 불러올 수 없습니다.',
      };
    }
  }
}
