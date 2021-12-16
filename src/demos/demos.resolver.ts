import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { DemoService } from './demos.service';
import { CreateDemoInput, CreateDemoOutput } from './dtos/create-demo.dto';
import { DeleteDemoInput, DeleteDemoOutput } from './dtos/delete-demo.dto';
import { EditDemoInput, EditDemoOutput } from './dtos/edit-demo.dto';
import { GetDemosInput, GetDemosOutput } from './dtos/get-demos.dto';
import { Demo } from './entities/demo.entity';

@Resolver(of => Demo)
export class DemoResolver {
  constructor(private readonly demoService: DemoService) {}

  @Mutation(returns => CreateDemoOutput)
  @Role(['CENSE'])
  async createDemo(
    @Args('input') createDemoInput: CreateDemoInput,
  ): Promise<CreateDemoOutput> {
    return this.demoService.createDemo(createDemoInput);
  }

  @Mutation(returns => EditDemoOutput)
  @Role(['CENSE'])
  async editDemo(
    @Args('input') editDemoInput: EditDemoInput,
  ): Promise<EditDemoOutput> {
    return this.demoService.editDemo(editDemoInput);
  }

  @Mutation(returns => DeleteDemoOutput)
  @Role(['CENSE'])
  async deleteDemo(
    @Args('input') deleteDemoInput: DeleteDemoInput,
  ): Promise<DeleteDemoOutput> {
    return this.demoService.deleteDemo(deleteDemoInput);
  }

  @Query(returns => GetDemosOutput)
  @Role(['CENSE'])
  async getDemos(
    @Args('input') getDemosInput: GetDemosInput,
  ): Promise<GetDemosOutput> {
    return this.demoService.getDemos(getDemosInput);
  }
}
