import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verification]),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    //     signOptions: {
    //       expiresIn: `${configService.get(
    //         'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    //       )}s`,
    //     },
    //   }),
    // }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
