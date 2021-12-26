import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateMaintenanceInput,
  CreateMaintenanceOutput,
} from './dtos/create-maintenance.dto';
import {
  DeleteMaintenanceInput,
  DeleteMaintenanceOutput,
} from './dtos/delete-maintenance.dto';
import {
  EditMaintenanceItemInfoInput,
  EditMaintenanceItemInfoOutput,
} from './dtos/edit-maintenanceItem.dto';
import {
  EditMaintenanceOutput,
  EditMaintenanceInput,
} from './dtos/edit-maintenance.dto';
import {
  GetMaintenanceInput,
  GetMaintenanceOutput,
} from './dtos/get-maintenance.dto';
import {
  GetMaintenancesInput,
  GetMaintenancesOutput,
} from './dtos/get-maintenances.dto';
import {
  GetMaintenanceItemsInput,
  GetMaintenanceItemsOutput,
} from './dtos/get-maintenanceItems.dto';
import { Maintenance } from './entities/maintenance.entity';
import { MaintenanceService } from './maintenances.service';

@Resolver(of => Maintenance)
export class MaintenanceResolver {
  constructor(private readonly maintenancesService: MaintenanceService) {}

  @Mutation(returns => CreateMaintenanceOutput)
  @Role(['CENSE', 'CEN'])
  async createMaintenance(
    @AuthUser() writer: User,
    @Args('input')
    createMaintenanceInput: CreateMaintenanceInput,
  ): Promise<CreateMaintenanceOutput> {
    return this.maintenancesService.createMaintenance(
      writer,
      createMaintenanceInput,
    );
  }

  @Mutation(returns => EditMaintenanceOutput)
  @Role(['CENSE', 'CEN'])
  async editMaintenance(
    @AuthUser() user: User,
    @Args('input')
    editMaintenanceInput: EditMaintenanceInput,
  ): Promise<EditMaintenanceOutput> {
    return this.maintenancesService.editMaintenance(user, editMaintenanceInput);
  }

  @Mutation(returns => DeleteMaintenanceOutput)
  @Role(['CENSE', 'CEN'])
  async deleteMaintenance(
    @AuthUser() user: User,
    @Args('input')
    deleteMaintenanceInput: DeleteMaintenanceInput,
  ): Promise<DeleteMaintenanceOutput> {
    return this.maintenancesService.deleteMaintenance(
      user,
      deleteMaintenanceInput,
    );
  }

  @Mutation(returns => EditMaintenanceItemInfoOutput)
  @Role(['CENSE', 'CEN'])
  async editMaintenanceItemInfo(
    @Args('input')
    editMaintenanceItemInfoInput: EditMaintenanceItemInfoInput,
  ): Promise<EditMaintenanceItemInfoOutput> {
    return this.maintenancesService.editMaintenanceItemInfo(
      editMaintenanceItemInfoInput,
    );
  }

  @Query(returns => GetMaintenancesOutput)
  @Role(['CENSE', 'CEN', 'Partner'])
  async getMaintenances(
    @AuthUser() user: User,
    @Args('input') getMaintenancesInput: GetMaintenancesInput,
  ): Promise<GetMaintenancesOutput> {
    return this.maintenancesService.getMaintenances(user, getMaintenancesInput);
  }

  @Query(returns => GetMaintenanceOutput)
  @Role(['CENSE', 'CEN', 'Partner'])
  async getMaintenance(
    @AuthUser() user: User,
    @Args('input') getMaintenanceInput: GetMaintenanceInput,
  ): Promise<GetMaintenanceOutput> {
    return this.maintenancesService.getMaintenance(user, getMaintenanceInput);
  }

  @Query(returns => GetMaintenanceItemsOutput)
  @Role(['CENSE', 'CEN', 'Partner'])
  async getMaintenanceItems(
    @AuthUser() user: User,
    @Args('input') getMaintenanceItemsInput: GetMaintenanceItemsInput,
  ): Promise<GetMaintenanceItemsOutput> {
    return this.maintenancesService.getMaintenanceItems(
      user,
      getMaintenanceItemsInput,
    );
  }

  @ResolveField(type => String)
  async maintenanceStatus(@Parent() maintenance: Maintenance): Promise<string> {
    return this.maintenancesService.maintenanceStatus(maintenance);
  }
}
