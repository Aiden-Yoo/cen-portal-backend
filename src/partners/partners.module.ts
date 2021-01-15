import { Module } from '@nestjs/common';
import { PartnerService } from './partners.service';
import { ContactResolver, PartnerResolver } from './partners.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, Contact])],
  providers: [PartnerService, PartnerResolver, ContactResolver],
})
export class PartnersModule {}
