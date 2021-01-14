import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import {
  CreatePartnerInput,
  CreatePartnerOutput,
} from './dtos/create-partner.dto';
import {
  DeletePartnerInput,
  DeletePartnerOutput,
} from './dtos/delete-partner.dto';
import { EditPartnerInput, EditPartnerOutput } from './dtos/edit-partner.dto';
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
}
