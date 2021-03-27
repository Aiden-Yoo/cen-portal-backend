import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  WorkaroundService,
  WorkaroundCommentService,
} from './workarounds.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { Workarounds } from './entities/workarounds.entity';
import {
  CreateWorkaroundInput,
  CreateWorkaroundOutput,
} from './dtos/create-workaround.dto';
import {
  AllWorkaroundsInput,
  AllWorkaroundsOutput,
} from '../workarounds/dtos/all-workarounds.dto';
import {
  DeleteWorkaroundInput,
  DeleteWorkaroundOutput,
} from './dtos/delete-workaround.dto';
import {
  EditWorkaroundInput,
  EditWorkaroundOutput,
} from './dtos/edit-workaround.dto';
import {
  GetWorkaroundInput,
  GetWorkaroundOutput,
} from './dtos/get-workaround.dto';
import {
  CreateWorkaroundCommentInput,
  CreateWorkaroundCommentOutput,
} from './dtos/create-workaroundComment.dto';
import { WorkaroundComments } from './entities/workaround-comments.entity';
import {
  GetWorkaroundCommentInput,
  GetWorkaroundCommentOutput,
} from './dtos/get-workaroundComments.dto';
import {
  DeleteWorkaroundCommentInput,
  DeleteWorkaroundCommentOutput,
} from './dtos/delete-workaroundComment.dto';
import {
  EditWorkaroundCommentInput,
  EditWorkaroundCommentOutput,
} from './dtos/edit-workaroundComment.dto';

@Resolver(of => Workarounds)
export class WorkaroundResolver {
  constructor(private readonly workaroundsService: WorkaroundService) {}

  @Query(returns => AllWorkaroundsOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async allWorkarounds(
    @AuthUser() user: User,
    @Args('input') allWorkaroundsInput: AllWorkaroundsInput,
  ): Promise<AllWorkaroundsOutput> {
    return this.workaroundsService.allWorkarounds(user, allWorkaroundsInput);
  }

  @ResolveField(type => Int)
  async commentsNum(@Parent() workarounds: Workarounds): Promise<number> {
    return this.workaroundsService.commentsNum(workarounds);
  }

  @Query(returns => GetWorkaroundOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async getWorkaround(
    @AuthUser() user: User,
    @Args('input') getWorkaroundsInput: GetWorkaroundInput,
  ): Promise<GetWorkaroundOutput> {
    return this.workaroundsService.getWorkaround(user, getWorkaroundsInput);
  }

  @Mutation(returns => CreateWorkaroundOutput)
  @Role(['CENSE'])
  async createWorkaround(
    @AuthUser() writer: User,
    @Args('input') createWorkaroundInput: CreateWorkaroundInput,
  ): Promise<CreateWorkaroundOutput> {
    return this.workaroundsService.createWorkaround(
      writer,
      createWorkaroundInput,
    );
  }

  @Mutation(returns => DeleteWorkaroundOutput)
  @Role(['CENSE'])
  async deleteWorkaround(
    @AuthUser() user: User,
    @Args('input') deleteWorkaroundInput: DeleteWorkaroundInput,
  ): Promise<DeleteWorkaroundOutput> {
    return this.workaroundsService.deleteWorkaround(
      user,
      deleteWorkaroundInput,
    );
  }

  @Mutation(returns => EditWorkaroundOutput)
  @Role(['CENSE'])
  async editWorkaround(
    @AuthUser() user: User,
    @Args('input') editWorkaroundInput: EditWorkaroundInput,
  ): Promise<EditWorkaroundOutput> {
    return this.workaroundsService.editWorkaround(user, editWorkaroundInput);
  }
}

@Resolver(of => WorkaroundComments)
export class WorkaroundCommentResolver {
  constructor(
    private readonly workaroundCommentsService: WorkaroundCommentService,
  ) {}

  @Query(returns => GetWorkaroundCommentOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async getWorkaroundComment(
    @Args('input') getWorkaroundCommentInput: GetWorkaroundCommentInput,
  ): Promise<GetWorkaroundCommentOutput> {
    return this.workaroundCommentsService.getWorkaroundComment(
      getWorkaroundCommentInput,
    );
  }

  @Mutation(returns => CreateWorkaroundCommentOutput)
  @Role(['CENSE'])
  async createWorkaroundComment(
    @AuthUser() writer: User,
    @Args('input') createWorkaroundCommentInput: CreateWorkaroundCommentInput,
  ): Promise<CreateWorkaroundCommentOutput> {
    return this.workaroundCommentsService.createWorkaroundComment(
      writer,
      createWorkaroundCommentInput,
    );
  }

  @Mutation(returns => DeleteWorkaroundCommentOutput)
  @Role(['CENSE'])
  async deleteWorkaroundComment(
    @AuthUser() user: User,
    @Args('input') deleteWorkaroundCommentInput: DeleteWorkaroundCommentInput,
  ): Promise<DeleteWorkaroundCommentOutput> {
    return this.workaroundCommentsService.deleteWorkaroundComment(
      user,
      deleteWorkaroundCommentInput,
    );
  }

  @Mutation(returns => EditWorkaroundCommentOutput)
  @Role(['CENSE'])
  async editWorkaroundComment(
    @AuthUser() user: User,
    @Args('input') editWorkaroundCommentInput: EditWorkaroundCommentInput,
  ): Promise<EditWorkaroundCommentOutput> {
    return this.workaroundCommentsService.editWorkaroundComment(
      user,
      editWorkaroundCommentInput,
    );
  }
}
