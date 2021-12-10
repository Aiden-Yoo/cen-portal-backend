import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User, UserRole } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import {
  ApprovalAccountInput,
  ApprovalAccountOutput,
} from './dtos/approval-account.dto';
import { AllUsersInput, AllUsersOutput } from './dtos/all-users.dto';
import { MailService } from 'src/mail/mail.service';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { LogoutOutput } from './dtos/logout.dto';
import { access } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // async getUser(id: number): Promise<UserProfileOutput> {
  //   try {
  //     const user = await this.users.findOneOrFail({ id });
  //     return {
  //       ok: true,
  //       user,
  //     };
  //   } catch (error) {
  //     return { ok: false, error: '사용자를 찾을 수 없습니다.' };
  //   }
  // }

  // async findById(id: number): Promise<UserProfileOutput> {
  //   try {
  //     const user = await this.users.findOneOrFail({ id });
  //     return {
  //       ok: true,
  //       user,
  //     };
  //   } catch (error) {
  //     return { ok: false, error: '사용자를 찾을 수 없습니다.' };
  //   }
  // }

  async createAccount({
    email,
    password,
    role,
    name,
    company,
    team,
    jobTitle,
    bio,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: '이미 동일한 email이 가입되어 있습니다.' };
      }
      if (role === 'CEN') {
        company = 'CoreEdge Networks';
      }
      const user = await this.users.save(
        this.users.create({
          email,
          password,
          role,
          name,
          company,
          team,
          jobTitle,
          bio,
        }),
      );
      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      await this.mailService.sendVerificationEmail(user, verification.code);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '계정을 생성할 수 없습니다. 관리자에게 문의해 주세요.',
      };
    }
  }

  async login(
    res: Response,
    { email, password }: LoginInput,
  ): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'email', 'password', 'verified', 'isLocked'] },
      );
      if (!user) {
        return {
          ok: false,
          error: '사용자 계정이 일치하지 않습니다.',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 일치하지 않습니다.',
        };
      }
      const exists = await this.verifications.findOne({ user });
      if (exists) {
        return {
          ok: false,
          error: '이메일 인증이 되지 않았습니다. 메일함을 확인해주세요.',
        };
      }
      if (!user.verified) {
        return {
          ok: false,
          error: '관리자 승인 대기중입니다. 관리자에게 문의 바랍니다.',
        };
      }
      if (user.isLocked) {
        return {
          ok: false,
          error: '계정이 잠겼습니다. 관리자에게 문의 바랍니다.',
        };
      }
      // const token = this.jwtService.sign(user.id);
      const accessToken = await this.getAccessTokenAndSetCookie(res, user.id);
      await this.getRefreshTokenAndSetCookie(res, user.id);
      return {
        ok: true,
        // token,
        token: accessToken,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  private async getAccessTokenAndSetCookie(res: Response, id: number) {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const accessOption = {
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) *
        1000,
    };
    res.cookie('Authentication', 'Bearer ' + accessToken, accessOption);
    return accessToken;
  }

  private async getRefreshTokenAndSetCookie(res: Response, id: number) {
    const payload = { id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const refreshOption = {
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) *
        1000,
    };
    res.cookie('Refresh', 'Bearer ' + refreshToken, refreshOption);
    return refreshToken;
  }

  async refresh(res: Response, id: number) {
    const accessToken = await this.getAccessTokenAndSetCookie(res, id);
    return 'Bearer ' + accessToken;
  }

  async matchCheck(res: Response, id: number) {
    const accessToken = await this.getAccessTokenAndSetCookie(res, id);
    return 'Bearer ' + accessToken;
  }

  async logout(res: Response, user: User): Promise<LogoutOutput> {
    try {
      const option = {
        path: '/',
        httpOnly: true,
        maxAge: 0,
      };
      res.cookie('Authentication', '', option);
      res.cookie('Refresh', '', option);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: '로그아웃 중 오류가 발생했습니다.',
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: '사용자를 찾을 수 없습니다.' };
    }
  }

  async allUsers({ page, take }: AllUsersInput): Promise<AllUsersOutput> {
    try {
      const [users, totalResults] = await this.users.findAndCount({
        skip: (page - 1) * take,
        take,
        order: { id: 'DESC' },
      });
      return {
        ok: true,
        users,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      return {
        ok: false,
        error: '사용자 정보를 불러올 수 없습니다.',
      };
    }
  }

  async editProfile(
    userId: number,
    {
      email,
      password,
      role,
      name,
      company,
      team,
      jobTitle,
      bio,
    }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);
      // if (email) {
      //   user.email = email;
      //   user.verified = false;
      //   await this.verifications.delete({ user: { id: user.id } });
      //   const verification = await this.verifications.save(
      //     this.verifications.create({ user }),
      //   );
      //   this.mailService.sendVerificationEmail(user.email, verification.code);
      // }
      if (password) {
        user.password = password;
      }
      // if (name) {
      //   user.name = name;
      // }
      if (company) {
        if (role === 'CEN' || 'CENSE') {
          company = 'CoreEdge Networks';
        }
        user.company = company;
      }
      if (team) {
        user.team = team;
      }
      if (jobTitle) {
        user.jobTitle = jobTitle;
      }
      if (bio) {
        user.bio = bio;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: '프로필을 업데이트할 수 없습니다.' };
    }
  }

  async editUser({
    userId,
    role,
    verified,
    isLocked,
    orderAuth,
  }: EditUserInput): Promise<EditUserOutput> {
    try {
      const user = await this.users.findOne(userId);
      if (role) {
        user.role = role;
      }
      if (verified !== null) {
        user.verified = verified;
      }
      if (isLocked !== null) {
        user.isLocked = isLocked;
      }
      if (orderAuth !== null) {
        user.orderAuth = orderAuth;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: '유저 상태를 변경할 수 없습니다.' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        // verification.user.verified = true;
        // await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: '유효하지 않은 인증코드 입니다.' };
    } catch (error) {
      return { ok: false, error: '메일을 인증하지 못했습니다.' };
    }
  }

  async approvalAccount(
    approvalAccountInput: ApprovalAccountInput,
  ): Promise<ApprovalAccountOutput> {
    try {
      const user = await this.users.findOne(approvalAccountInput.userId);
      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }
      await this.users.save({
        id: approvalAccountInput.userId,
        ...approvalAccountInput,
      });
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '계정을 수정할 수 없습니다.',
      };
    }
  }
}
