import { Response } from 'express';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthUser, ResGql } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { AllUsersInput, AllUsersOutput } from './dtos/all-users.dto';
import {
  ApprovalAccountInput,
  ApprovalAccountOutput,
} from './dtos/approval-account.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { LogoutOutput } from './dtos/logout.dto';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Mutation(returns => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(returns => LoginOutput)
  async login(
    @ResGql() res: Response,
    @Args('input') loginInput: LoginInput,
  ): Promise<LoginOutput> {
    return this.usersService.login(res, loginInput);
  }

  @Mutation(() => LogoutOutput)
  @Role(['Any'])
  async logout(
    @ResGql() res: Response,
    @AuthUser() user: User,
  ): Promise<LogoutOutput> {
    return this.usersService.logout(res, user);
  }

  @Query(returns => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(returns => UserProfileOutput)
  @Role(['Any'])
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Query(returns => AllUsersOutput)
  @Role(['CENSE'])
  async allUsers(
    @Args('input') allUsersInput: AllUsersInput,
  ): Promise<AllUsersOutput> {
    return this.usersService.allUsers(allUsersInput);
  }

  @Mutation(returns => EditProfileOutput)
  @Role(['Any'])
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(returns => EditUserOutput)
  @Role(['CENSE'])
  async editUser(
    @AuthUser() authUser: User,
    @Args('input') edituserInput: EditUserInput,
  ): Promise<EditUserOutput> {
    return this.usersService.editUser(edituserInput);
  }

  @Mutation(returns => VerifyEmailOutput)
  async verifyEmail(
    @Args('input') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(code);
  }

  @Mutation(returns => ApprovalAccountOutput)
  @Role(['CENSE'])
  async approvalAccount(
    @Args('input') approvalAccountInput: ApprovalAccountInput,
  ): Promise<ApprovalAccountOutput> {
    return this.usersService.approvalAccount(approvalAccountInput);
  }
}
