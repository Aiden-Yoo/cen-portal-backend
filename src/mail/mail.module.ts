import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MailModuleOptions } from './mail.interfaces';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      imports: [
        MailerModule.forRoot({
          transport: {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              type: 'login',
              user: process.env.MAIL_ID,
              pass: process.env.MAIL_PW,
            },
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
      ],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
