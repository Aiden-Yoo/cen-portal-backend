import {
  Args,
  Query,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { CreateRmaInput, CreateRmaOutput } from './dtos/create-rma.dto';
import { DeleteRmaInput, DeleteRmaOutput } from './dtos/delete-rma.dto';
import { EditRmaInput, EditRmaOutput } from './dtos/edit-rma.dto';
import { GetRmasInput, GetRmasOutput } from './dtos/get-rmas.dto';
import { Rma } from './entities/rma.entity';
import { RmaService } from './rmas.service';

@Resolver(of => Rma)
export class RmaResolver {
  constructor(private readonly rmaService: RmaService) {}

  @Mutation(returns => CreateRmaOutput)
  @Role(['CENSE'])
  async createRma(
    @Args('input') createRmaInput: CreateRmaInput,
  ): Promise<CreateRmaOutput> {
    return this.rmaService.createRma(createRmaInput);
  }

  @Mutation(returns => EditRmaOutput)
  @Role(['CENSE'])
  async editRma(
    @Args('input') editRmaInput: EditRmaInput,
  ): Promise<EditRmaOutput> {
    return this.rmaService.editRma(editRmaInput);
  }

  @Mutation(returns => DeleteRmaOutput)
  @Role(['CENSE'])
  async deleteRma(
    @Args('input') deleteRmaInput: DeleteRmaInput,
  ): Promise<DeleteRmaOutput> {
    return this.rmaService.deleteRma(deleteRmaInput);
  }

  @Query(returns => GetRmasOutput)
  @Role(['CENSE'])
  async getRmas(
    @Args('input') getRmasInput: GetRmasInput,
  ): Promise<GetRmasOutput> {
    return this.rmaService.getRmas(getRmasInput);
  }

  @ResolveField(type => String)
  async rmaStatus(@Parent() rma: Rma): Promise<string> {
    return this.rmaService.rmaStatus(rma);
  }
}
