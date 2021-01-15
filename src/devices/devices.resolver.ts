import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { DeviceService } from './devices.service';
import {
  CreateBundleInput,
  CreateBundleOutput,
} from './dtos/create-bundle.dto';
import { CreatePartInput, CreatePartOutput } from './dtos/create-part.dto';
import {
  DeleteBundleInput,
  DeleteBundleOutput,
} from './dtos/delete-bundle.dto';
import { DeletePartInput, DeletePartOutput } from './dtos/delete-part.dto';
import { EditBundleInput, EditBundleOutput } from './dtos/edit-bundle.dto';
import { EditPartInput, EditPartOutput } from './dtos/edit-part.dto';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Resolver(of => Bundle)
export class BundleResolver {
  constructor(private readonly deviceService: DeviceService) {}

  @Mutation(returns => CreateBundleOutput)
  @Role(['CEN'])
  async createBundle(
    @Args('input') createBundleInput: CreateBundleInput,
  ): Promise<CreateBundleOutput> {
    return this.deviceService.createBundle(createBundleInput);
  }

  @Mutation(returns => EditBundleOutput)
  @Role(['CEN'])
  async editBundle(
    @Args('input') editBundleInput: EditBundleInput,
  ): Promise<EditBundleOutput> {
    return this.deviceService.editBundle(editBundleInput);
  }

  @Mutation(returns => DeleteBundleOutput)
  @Role(['CEN'])
  async deleteBundle(
    @Args('input') deleteBundleInput: DeleteBundleInput,
  ): Promise<DeleteBundleOutput> {
    return this.deviceService.deleteBundle(deleteBundleInput);
  }
}

@Resolver(of => Part)
export class PartResolver {
  constructor(private readonly deviceService: DeviceService) {}

  @Mutation(returns => CreatePartOutput)
  @Role(['CEN'])
  async createPart(
    @Args('input') createPartInput: CreatePartInput,
  ): Promise<CreatePartOutput> {
    return this.deviceService.createPart(createPartInput);
  }

  @Mutation(returns => EditPartOutput)
  @Role(['CEN'])
  async editPart(
    @Args('input') editPartInput: EditPartInput,
  ): Promise<EditPartOutput> {
    return this.deviceService.editPart(editPartInput);
  }

  @Mutation(returns => DeletePartOutput)
  @Role(['CEN'])
  async deletePart(
    @Args('input') deletePartInput: DeletePartInput,
  ): Promise<DeletePartOutput> {
    return this.deviceService.deletePart(deletePartInput);
  }
}
