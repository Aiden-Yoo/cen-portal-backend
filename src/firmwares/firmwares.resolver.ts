import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FirmwareService } from './firmwares.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { Firmwares } from './entities/firmwares.entity';
import {
  CreateFirmwareInput,
  CreateFirmwareOutput,
} from './dtos/create-firmware.dto';
import {
  AllFirmwaresInput,
  AllFirmwaresOutput,
} from '../firmwares/dtos/all-firmwares.dto';
import {
  DeleteFirmwareInput,
  DeleteFirmwareOutput,
} from './dtos/delete-firmware.dto';
import {
  EditFirmwareInput,
  EditFirmwareOutput,
} from './dtos/edit-firmware.dto';
import { GetFirmwareInput, GetFirmwareOutput } from './dtos/get-firmware.dto';

@Resolver(of => Firmwares)
export class FirmwareResolver {
  constructor(private readonly firmwaresService: FirmwareService) {}

  @Query(returns => AllFirmwaresOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async allFirmwares(
    @AuthUser() user: User,
    @Args('input') allFirmwaresInput: AllFirmwaresInput,
  ): Promise<AllFirmwaresOutput> {
    return this.firmwaresService.allFirmwares(user, allFirmwaresInput);
  }

  @Query(returns => GetFirmwareOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async getFirmware(
    @AuthUser() user: User,
    @Args('input') getFirmwaresInput: GetFirmwareInput,
  ): Promise<GetFirmwareOutput> {
    return this.firmwaresService.getFirmware(user, getFirmwaresInput);
  }

  @Mutation(returns => CreateFirmwareOutput)
  @Role(['CENSE'])
  async createFirmware(
    @AuthUser() writer: User,
    @Args('input') createFirmwareInput: CreateFirmwareInput,
  ): Promise<CreateFirmwareOutput> {
    return this.firmwaresService.createFirmware(writer, createFirmwareInput);
  }

  @Mutation(returns => DeleteFirmwareOutput)
  @Role(['CENSE'])
  async deleteFirmware(
    @AuthUser() user: User,
    @Args('input') deleteFirmwareInput: DeleteFirmwareInput,
  ): Promise<DeleteFirmwareOutput> {
    return this.firmwaresService.deleteFirmware(user, deleteFirmwareInput);
  }

  @Mutation(returns => EditFirmwareOutput)
  @Role(['CENSE'])
  async editFirmware(
    @AuthUser() user: User,
    @Args('input') editFirmwareInput: EditFirmwareInput,
  ): Promise<EditFirmwareOutput> {
    return this.firmwaresService.editFirmware(user, editFirmwareInput);
  }
}
