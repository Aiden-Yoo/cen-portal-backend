import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(user: User, token: string) {
    try {
      const url = `${process.env.SVR_DOMAIN}/auth/confirm?token=${token}`;
      await this.mailerService.sendMail({
        from: '"코어엣지네트웍스" <noreply@coreedge.co.kr>',
        to: user.email,
        subject: '[코어엣지네트웍스] 이메일 인증 메일',
        template: './confirmation',
        context: {
          name: user.name,
          url,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
