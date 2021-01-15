import {
  Args,
  Query,
  Mutation,
  Resolver,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { AllContactsOutput } from './dtos/all-contacts.dto';
import { AllPartnersOutput } from './dtos/all-partners.dto';
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
import { PartnerService } from './partners.service';

@Resolver(of => Partner)
export class PartnerResolver {
  constructor(private readonly partnerService: PartnerService) {}

  @Mutation(returns => CreatePartnerOutput)
  @Role(['CEN'])
  async createPartner(
    @Args('input') createPartnerInput: CreatePartnerInput,
  ): Promise<CreatePartnerOutput> {
    return this.partnerService.createPartner(createPartnerInput);
  }

  @Mutation(returns => EditPartnerOutput)
  @Role(['CEN'])
  async editPartner(
    @Args('input') editPartnerInput: EditPartnerInput,
  ): Promise<EditPartnerOutput> {
    return this.partnerService.editPartner(editPartnerInput);
  }

  @Mutation(returns => DeletePartnerOutput)
  @Role(['CEN'])
  async deletePartner(
    @Args('input') deletePartnerInput: DeletePartnerInput,
  ): Promise<DeletePartnerOutput> {
    return this.partnerService.deletePartner(deletePartnerInput);
  }

  @Query(returns => AllPartnersOutput)
  @Role(['CEN'])
  async allPartners(): Promise<AllPartnersOutput> {
    return this.partnerService.allPartners();
  }

  @ResolveField(type => Int)
  async contactsCount(@Parent() partner: Partner): Promise<number> {
    return this.partnerService.countContacts(partner);
  }

  @Query(returns => PartnerOutput)
  @Role(['CEN'])
  async findPartnerById(
    @Args('input') partnerInpur: PartnerInput,
  ): Promise<PartnerOutput> {
    return this.partnerService.findPartnerById(partnerInpur);
  }
}

@Resolver(of => Contact)
export class ContactResolver {
  constructor(private readonly partnerService: PartnerService) {}

  @Mutation(returns => CreateContactOutput)
  @Role(['CEN'])
  async createContact(
    @Args('input') createContactInput: CreateContactInput,
  ): Promise<CreateContactOutput> {
    return this.partnerService.createContact(createContactInput);
  }

  @Mutation(returns => EditContactOutput)
  @Role(['CEN'])
  async editContact(
    @Args('input') editContactInput: EditContactInput,
  ): Promise<EditContactOutput> {
    return this.partnerService.editContact(editContactInput);
  }

  @Mutation(returns => DeleteContactOutput)
  @Role(['CEN'])
  async deleteContact(
    @Args('input') deleteContactInput: DeleteContactInput,
  ): Promise<DeleteContactOutput> {
    return this.partnerService.deleteContact(deleteContactInput);
  }

  @Query(returns => AllContactsOutput)
  @Role(['CEN'])
  async allContacts(): Promise<AllContactsOutput> {
    return this.partnerService.allContacts();
  }
}
