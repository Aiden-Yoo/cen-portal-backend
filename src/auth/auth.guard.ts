import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
// import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { AllowedRoles } from './role.decorator';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly jwtService: JwtService,
//     private readonly userService: UserService,
//     private readonly configService: ConfigService,
//   ) {}
//   async canActivate(context: ExecutionContext) {
//     const roles = this.reflector.get<AllowedRoles>(
//       'roles',
//       context.getHandler(),
//     );
//     if (!roles) {
//       return true;
//     }
//     const gqlContext = GqlExecutionContext.create(context).getContext();
//     // refresh token check
//     const decodedRefresh = await this.checkRefreshToken(gqlContext);
//     if (!decodedRefresh) {
//       return false;
//     }
//     // access token check
//     const valid = await this.checkAccessToken(
//       gqlContext,
//       roles,
//       decodedRefresh,
//     );
//     if (!valid) {
//       return false;
//     }
//     return true;
//   }

//   async checkRefreshToken(gqlContext: any) {
//     const refresh = gqlContext.req.cookies['Refresh'];
//     if (!refresh) {
//       return false;
//     }
//     if (refresh.split(' ')[0] !== 'Bearer') {
//       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
//     }
//     const refreshToken = refresh.split(' ')[1];
//     if (refreshToken) {
//       const decodedRefresh = this.jwtService.verify(refreshToken.toString(), {
//         secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
//       });
//       if (
//         typeof decodedRefresh === 'object' &&
//         decodedRefresh.hasOwnProperty('id')
//       ) {
//         return decodedRefresh;
//       }
//     }
//     return false;
//   }

//   async checkAccessToken(
//     gqlContext: any,
//     roles: AllowedRoles,
//     decodedRefresh: any,
//   ) {
//     let auth = gqlContext.req.cookies['Authentication'];
//     if (!auth) {
//       const newAccessToken = await this.userService.refresh(
//         gqlContext.res,
//         decodedRefresh['id'],
//       );
//       auth = newAccessToken;
//     }
//     if (auth.split(' ')[0] !== 'Bearer') {
//       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
//     }
//     const accessToken = auth.split(' ')[1];
//     if (accessToken) {
//       const decodedAccess = this.jwtService.verify(accessToken.toString());
//       if (
//         typeof decodedAccess === 'object' &&
//         decodedAccess.hasOwnProperty('id')
//       ) {
//         const { user } = await this.userService.findById(decodedAccess['id']);
//         if (user) {
//           gqlContext['user'] = user;
//           if (roles.includes('Any')) {
//             return true;
//           }
//           return roles.includes(user.role);
//         }
//       }
//     }
//     return false;
//   }
// }

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
        if (user) {
          gqlContext['user'] = user;
          if (roles.includes('Any')) {
            return true;
          }
          return roles.includes(user.role);
        }
      }
    }
    return false;
  }
}
