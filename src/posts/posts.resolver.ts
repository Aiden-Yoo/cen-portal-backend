import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './posts.service';
import { HomeNotice } from './entities/home-notice.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateHomeNoticeInput,
  CreateHomeNoticeOutput,
} from './dtos/create-homeNotice.dto';
import { GetHomeNoticeOutput } from './dtos/get-homeNotice.dto';

@Resolver(of => HomeNotice)
export class PostResolver {
  constructor(private readonly postsService: PostService) {}

  @Mutation(returns => CreateHomeNoticeOutput)
  @Role(['CENSE'])
  async createHomeNotice(
    @AuthUser() writer: User,
    @Args('input') createHomeNoticeInput: CreateHomeNoticeInput,
  ): Promise<CreateHomeNoticeOutput> {
    return this.postsService.createHomeNotice(writer, createHomeNoticeInput);
  }

  @Query(returns => GetHomeNoticeOutput)
  async getHomeNotice(): Promise<GetHomeNoticeOutput> {
    return this.postsService.getHomeNotice();
  }
}
