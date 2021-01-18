import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Part } from 'src/devices/entities/part.entity';
import { Partner } from 'src/partners/entities/partner.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { DeleteOrderInput, DeleteOrderOutput } from './dtos/delete-order.dto';
import { EditItemInfoInput, EditItemInfoOutput } from './dtos/edit-item.dto';
import { EditOPrderOutput, EditOrderInput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { ItemInfo } from './entities/item-info.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(ItemInfo)
    private readonly itemInfos: Repository<ItemInfo>,
    @InjectRepository(Partner)
    private readonly partners: Repository<Partner>,
    @InjectRepository(Bundle)
    private readonly bundles: Repository<Bundle>,
    @InjectRepository(Part)
    private readonly parts: Repository<Part>,
  ) {}

  async createOrder(
    writer: User,
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const partner = await this.partners.findOne(createOrderInput.partnerId);
      if (!partner) {
        return {
          ok: false,
          error: '파트너를 찾을 수 없습니다.',
        };
      }
      const orderItems: OrderItem[] = [];
      const itemInfo: ItemInfo[] = [];
      for (const item of createOrderInput.items) {
        const bundle = await this.bundles.findOne(item.bundleId);
        if (!bundle) {
          return {
            ok: false,
            error: '번들을 찾을 수 없습니다.',
          };
        }
        // // for order-item
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            bundle,
            num: item.num,
          }),
        );
        orderItems.push(orderItem);
      }
      // for order
      const order = await this.orders.save(
        this.orders.create({
          ...createOrderInput,
          writer,
          partner,
          items: orderItems,
        }),
      );
      console.log(orderItems);
      ///////////////////for itme-info
      for (const orderItem of orderItems) {
        // orderItem.num // number of bundle
        // orderItem.bundle.id // bundle id
        const { parts } = await this.bundles.findOne(orderItem.bundle.id, {
          relations: ['parts'],
        });
        console.log(parts);
        for (const partlist of parts) {
          // console.log(partlist.name + ': ' + partlist.num + 'x' + orderItem.num);
          for (
            let count: number = 0;
            count < partlist.num * orderItem.num;
            count++
          ) {
            await this.itemInfos.save(
              this.itemInfos.create({
                name: partlist.name,
                order,
              }),
            );
          }
        }
      }
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '출고요청서를 생성할 수 없습니다.',
      };
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let canSee = true;
    if (user.role === UserRole.CEN && order.writerId !== user.id) {
      canSee = false;
    }
    return canSee;
  }

  async editOrder(
    user: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOPrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['partner'],
      });
      if (!order) {
        return {
          ok: false,
          error: '출고요청서를 찾을 수 없습니다.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: '작성자만 볼 수 있습니다.',
        };
      }
      let canEdit = true;
      if (user.role === UserRole.CENSE) {
        if (status === OrderStatus.Created) {
          canEdit = false;
        }
      }
      if (user.role === UserRole.CEN) {
        if (status !== OrderStatus.Pending && status !== OrderStatus.Canceled) {
          canEdit = false;
        }
      }
      if (!canEdit) {
        return {
          ok: false,
          error: `'${status}' 상태로 변경할 수 없습니다.`,
        };
      }
      await this.orders.save([
        {
          id: orderId,
          status,
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '출고요청서를 수정할 수 없습니다.',
      };
    }
  }

  async deleteOrder(
    user: User,
    { orderId }: DeleteOrderInput,
  ): Promise<DeleteOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['partner'],
      });
      if (!order) {
        return {
          ok: false,
          error: '출고요청서를 찾을 수 없습니다.',
        };
      }
      if (user.role === UserRole.CEN) {
        // if (order.writerId !== user.id) {
        //   return {
        //     ok:false,
        //     error: "다른 작성자의 출고요청서입니다. 삭제할 수 없습니다."
        //   }
        // }
        return {
          ok: false,
          error:
            '출고요청서를 삭제할 수 없습니다.\n출고취소 상태로 변경해주세요.',
        };
      }

      await this.orders.delete(orderId);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '출고요청서를 삭제할 수 없습니다.',
      };
    }
  }

  async editItemInfo(
    editItemInfoInput: EditItemInfoInput,
  ): Promise<EditItemInfoOutput> {
    try {
      const order = await this.itemInfos.findOne(editItemInfoInput.itemInfoId);
      if (!order) {
        return {
          ok: false,
          error: '해당 물품을 찾을 수 없습니다.',
        };
      }
      await this.itemInfos.save([
        {
          id: editItemInfoInput.itemInfoId,
          ...editItemInfoInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '물품 정보를 수정할 수 없습니다.',
      };
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];
      if (user.role === UserRole.CEN) {
        orders = await this.orders.find({
          where: {
            writer: user,
            ...(status && { status }),
          },
          relations: ['itemInfos'],
        });
      } else if (user.role === UserRole.CENSE) {
        orders = await this.orders.find({ relations: ['itemInfos'] });
      }
      return {
        ok: true,
        orders,
      };
    } catch (e) {
      return {
        ok: false,
        error: '출고요청서를 불러올 수 없습니다.',
      };
    }
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['writer', 'partner', 'items', 'itemInfos'],
      });
      if (!order) {
        return {
          ok: false,
          error: '존재하지 않는 출고요청서 입니다.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: '작성자만 볼 수 있습니다.',
        };
      }
      return {
        ok: true,
        order,
      };
    } catch {
      return {
        ok: false,
        error: '출고요청서를 불러올 수 없습니다.',
      };
    }
  }
}
