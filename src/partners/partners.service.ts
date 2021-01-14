import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { PartnerRepository } from './repositories/partner.repository';

@Injectable()
export class PartnerService {
  constructor(
    private readonly partners: PartnerRepository,
    @InjectRepository(Contact)
    private readonly contact: Repository<Contact>,
  ) {}
}
