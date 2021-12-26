import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}

// @Module({
//   imports: [
//     UsersModule,
//     TypeOrmModule.forFeature([User]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
//         signOptions: {
//           expiresIn: `${configService.get(
//             'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
//           )}s`,
//         },
//       }),
//     }),
//   ],
//   providers: [
//     {
//       provide: APP_GUARD,
//       useClass: AuthGuard,
//     },
//   ],
// })
// export class AuthModule {}
