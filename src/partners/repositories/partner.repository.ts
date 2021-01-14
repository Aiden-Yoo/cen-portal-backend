import { EntityRepository, Repository } from 'typeorm';
import { Partner } from '../entities/partner.entity';

@EntityRepository(Partner)
export class PartnerRepository extends Repository<Partner> {
  async getOrCreate(name: string): Promise<Partner> {
    const partnerName = name.trim();
    const partnerSlug = partnerName.toLowerCase().replace(/ /g, '-');
    let partner = await this.findOne({ slug: partnerSlug });
    if (!partner) {
      partner = await this.save(
        this.create({ slug: partnerSlug, name: partnerName }),
      );
    }
    return partner;
  }
}
