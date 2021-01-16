import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { DeviceService } from './devices.service';
import { AllBundlesInput, AllBundlesOutput } from './dtos/all-bundles.dto';
import { AllPartsInput, AllPartsOutput } from './dtos/all-parts.dto';
import { BundleInput, BundleOutput } from './dtos/bundle.dto';
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
import { PartInput, PartOutput } from './dtos/part.dto';
import {
  SearchBundleInput,
  SearchBundleOutput,
} from './dtos/search-bundle.dto';
import { SearchPartInput, SearchPartOutput } from './dtos/search-part.dto';
import { Bundle } from './entities/bundle.entity';
import { Part } from './entities/part.entity';

@Resolver(of => Bundle)
export class BundleResolver {
  constructor(private readonly deviceService: DeviceService) {}

  @Mutation(returns => CreateBundleOutput)
  @Role(['CENSE'])
  async createBundle(
    @Args('input') createBundleInput: CreateBundleInput,
  ): Promise<CreateBundleOutput> {
    return this.deviceService.createBundle(createBundleInput);
  }

  @Mutation(returns => EditBundleOutput)
  @Role(['CENSE'])
  async editBundle(
    @Args('input') editBundleInput: EditBundleInput,
  ): Promise<EditBundleOutput> {
    return this.deviceService.editBundle(editBundleInput);
  }

  @Mutation(returns => DeleteBundleOutput)
  @Role(['CENSE'])
  async deleteBundle(
    @Args('input') deleteBundleInput: DeleteBundleInput,
  ): Promise<DeleteBundleOutput> {
    return this.deviceService.deleteBundle(deleteBundleInput);
  }

  @Query(returns => AllBundlesOutput)
  @Role(['CENSE', 'CEN'])
  async allBundles(
    @Args('input') allBundlesInput: AllBundlesInput,
  ): Promise<AllBundlesOutput> {
    return this.deviceService.allBundles(allBundlesInput);
  }

  @Query(returns => BundleOutput)
  @Role(['CENSE', 'CEN'])
  async findBundleById(
    @Args('input') bundleInput: BundleInput,
  ): Promise<BundleOutput> {
    return this.deviceService.findBundleById(bundleInput);
  }

  @Query(returns => SearchBundleOutput)
  @Role(['CENSE', 'CEN'])
  async searchBundle(
    @Args('input') searchBundleInput: SearchBundleInput,
  ): Promise<SearchBundleOutput> {
    return this.deviceService.searchBundleByName(searchBundleInput);
  }
}

@Resolver(of => Part)
export class PartResolver {
  constructor(private readonly deviceService: DeviceService) {}

  @Mutation(returns => CreatePartOutput)
  @Role(['CENSE'])
  async createPart(
    @Args('input') createPartInput: CreatePartInput,
  ): Promise<CreatePartOutput> {
    return this.deviceService.createPart(createPartInput);
  }

  @Mutation(returns => EditPartOutput)
  @Role(['CENSE'])
  async editPart(
    @Args('input') editPartInput: EditPartInput,
  ): Promise<EditPartOutput> {
    return this.deviceService.editPart(editPartInput);
  }

  @Mutation(returns => DeletePartOutput)
  @Role(['CENSE'])
  async deletePart(
    @Args('input') deletePartInput: DeletePartInput,
  ): Promise<DeletePartOutput> {
    return this.deviceService.deletePart(deletePartInput);
  }

  @Query(returns => AllPartsOutput)
  @Role(['CENSE', 'CEN'])
  async allParts(
    @Args('input') allPartsInput: AllPartsInput,
  ): Promise<AllPartsOutput> {
    return this.deviceService.allParts(allPartsInput);
  }

  @Query(returns => PartOutput)
  @Role(['CENSE', 'CEN'])
  async findPartById(
    @Args('input') bundleInput: PartInput,
  ): Promise<PartOutput> {
    return this.deviceService.findPartById(bundleInput);
  }

  @Query(returns => SearchPartOutput)
  @Role(['CENSE', 'CEN'])
  async searchPart(
    @Args('input') searchPartInput: SearchPartInput,
  ): Promise<SearchPartOutput> {
    return this.deviceService.searchPartByName(searchPartInput);
  }
}
