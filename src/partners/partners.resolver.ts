import { Resolver } from '@nestjs/graphql';
import { Partner } from './entities/partner.entity';
import { PartnerService } from './partners.service';

@Resolver(of => Partner)
export class PartnerResolver {
  constructor(private readonly partnerService: PartnerService) {}
}
