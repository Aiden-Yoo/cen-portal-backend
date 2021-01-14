import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
