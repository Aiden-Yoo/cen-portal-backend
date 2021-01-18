import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Part } from 'src/devices/entities/part.entity';
import { Partner } from 'src/partners/entities/partner.entity';
import { ItemInfo } from './entities/item-info.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      ItemInfo,
      Bundle,
      Partner,
      Bundle,
      Part,
    ]),
  ],
  providers: [OrderService, OrderResolver],
})
export class OrdersModule {}
