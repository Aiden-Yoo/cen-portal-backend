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
import { Demo } from './demos/entities/demo.entity';
import { DemosModule } from './demos/demos.module';
import { RmasModule } from './rmas/rmas.module';
import { Rma } from './rmas/entities/rma.entity';
import { MaintanencesModule } from './maintenances/maintenances.module';
import { Maintenance } from './maintenances/entities/maintenance.entity';
import { MaintenanceItem } from './maintenances/entities/maintenance-item.entity';
import { MaintenanceItemInfo } from './maintenances/entities/maintenance-itemInfo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
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
        // PRIVATE_KEY: Joi.string().required(),
        SVR_DOMAIN: Joi.string().required(),
        TECH_MAIL: Joi.string().required(),
        STOCK_MAIL: Joi.string().required(),
        MAIL_ID: Joi.string().required(),
        MAIL_PW: Joi.string().required(),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
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
        Demo,
        Rma,
        Maintenance,
        MaintenanceItem,
        MaintenanceItemInfo,
      ],
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      playground: process.env.NODE_ENV !== 'prod',
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
      // cors: { origin: true, credentials: true },
      // context: ({ req, res }) => ({ req, res }),
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      mailId: process.env.MAIL_ID,
      mailPw: process.env.MAIL_PW,
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
    DemosModule,
    RmasModule,
    MaintanencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
