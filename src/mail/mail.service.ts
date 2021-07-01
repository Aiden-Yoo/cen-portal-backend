import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  DeliveryMethod,
  DeliveryType,
  Order,
  OrderClassification,
} from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(user: User, code: string) {
    try {
      const url = `${process.env.SVR_DOMAIN}/auth/confirm?code=${code}`;
      await this.mailerService.sendMail({
        from: '"코어엣지네트웍스" <noreply@coreedge.co.kr>',
        to: user.email,
        subject: '[CEN Portal] 이메일 인증 메일',
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

  async notifyNewOrder(order: Order) {
    try {
      let deliveryType: string;
      let deliveryMethod: string;
      let classification: string;

      switch (order.deliveryType) {
        case DeliveryType.Partial:
          deliveryType = '부분출고';
        case DeliveryType.Total:
          deliveryType = '전체출고';
      }
      switch (order.deliveryMethod) {
        case DeliveryMethod.Cargo:
          deliveryMethod = '화물';
        case DeliveryMethod.Directly:
          deliveryMethod = '직접배송';
        case DeliveryMethod.Parcel:
          deliveryMethod = '택배';
        case DeliveryMethod.Quick:
          deliveryMethod = '퀵';
      }
      switch (order.classification) {
        case OrderClassification.Demo:
          classification = '데모';
        case OrderClassification.DoA:
          classification = 'DoA';
        case OrderClassification.RMA:
          classification = 'RMA';
        case OrderClassification.Sale:
          classification = '판매';
      }

      this.mailerService.sendMail({
        from: '"코어엣지네트웍스" <noreply@coreedge.co.kr>',
        to: 'djyoo@coreedge.co.kr',
        subject: `[CEN Portal] 출고요청서 등록_${order.projectName}/${order.partner.name}/${order.salesPerson}`,
        template: './newOrder',
        context: {
          writer: order.writer.name,
          salesPerson: order.salesPerson,
          projectName: order.projectName,
          partner: order.partner.name,
          deliveryType,
          deliveryMethod,
          classification,
          url: `${process.env.SVR_DOMAIN}/cen/orders/${order.id}`,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
