import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { PartnersModule } from './partners/partners.module';
import { Partner } from './partners/entities/partner.entity';
import { Contact } from './partners/entities/contact.entity';
import { DevicesModule } from './devices/devices.module';
import { Bundle } from './devices/entities/bundle.entity';
import { Part } from './devices/entities/part.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { ItemInfo } from './orders/entities/item-info.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { BundleItem } from './devices/entities/bundle-item.entity';
import { PostsModule } from './posts/posts.module';
import { HomeNotice } from './posts/entities/home-notice.entity';
import { UploadsModule } from './uploads/uploads.module';
import { Issues } from './issues/entities/issues.entity';
import { IssueComments } from './issues/entities/issue-comments.entity';
import { IssueFiles } from './issues/entities/issue-files.entity';
import { IssuesModule } from './issues/issues.module';
import { WorkaroundsModule } from './workarounds/workarounds.module';
import { Workarounds } from './workarounds/entities/workarounds.entity';
import { WorkaroundComments } from './workarounds/entities/workaround-comments.entity';
import { WorkaroundFiles } from './workarounds/entities/workaround-files.entity';
import { FirmwaresModule } from './firmwares/firmwares.module';
import { Firmwares } from './firmwares/entities/firmwares.entity';
import { FirmwareFiles } from './firmwares/entities/firmware-files.entity';
import { DocumentsModule } from './documents/documents.module';
import { Documents } from './documents/entities/documents.entity';
import { DocumentFiles } from './documents/entities/document-files.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test')
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NOTE_ENV !== 'prod',
      logging:
        process.env.NOTE_ENV !== 'prod' && process.env.NOTE_ENV !== 'test',
      entities: [
        User,
        Verification,
        Partner,
        Contact,
        Bundle,
        Part,
        BundleItem,
        Order,
        OrderItem,
        ItemInfo,
        HomeNotice,
        Issues,
        IssueComments,
        IssueFiles,
        Workarounds,
        WorkaroundComments,
        WorkaroundFiles,
        Firmwares,
        FirmwareFiles,
        Documents,
        DocumentFiles,
      ],
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    UsersModule,
    PartnersModule,
    DevicesModule,
    OrdersModule,
    PostsModule,
    IssuesModule,
    UploadsModule,
    WorkaroundsModule,
    FirmwaresModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
