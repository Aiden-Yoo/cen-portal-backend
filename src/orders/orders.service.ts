import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bundle } from 'src/devices/entities/bundle.entity';
import { Part } from 'src/devices/entities/part.entity';
import { MailService } from 'src/mail/mail.service';
import { Partner } from 'src/partners/entities/partner.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository, Raw, Not, ILike } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { DeleteOrderInput, DeleteOrderOutput } from './dtos/delete-order.dto';
import { EditItemInfoInput, EditItemInfoOutput } from './dtos/edit-item.dto';
import { EditOrderOutput, EditOrderInput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import {
  GetOrderItemsInput,
  GetOrderItemsOutput,
} from './dtos/get-orderItems.dto';
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
    private readonly mailService: MailService,
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
      let order = await this.orders.save(
        this.orders.create({
          ...createOrderInput,
          writer,
          partner,
          items: null,
        }),
      );
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
        // for order-item
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            bundle,
            num: item.num,
            order,
          }),
        );
        orderItems.push(orderItem);
      }
      // for order
      const findOrder = await this.orders.findOne(order.id, {
        relations: ['writer', 'partner'],
      });
      order = await this.orders.save({
        ...findOrder,
        items: orderItems,
      });
      // for itme-info
      for (const orderItem of orderItems) {
        // orderItem.num // number of bundle
        // orderItem.bundle.id // bundle id
        const { parts } = await this.bundles.findOne(orderItem.bundle.id, {
          relations: ['parts', 'parts.part'],
        });
        for (const partlist of parts) {
          // console.log(partlist);
          // console.log(
          //   partlist.part.name + ': ' + partlist.num + 'x' + orderItem.num,
          // );
          for (let count = 0; count < partlist.num * orderItem.num; count++) {
            await this.itemInfos.save(
              this.itemInfos.create({
                name: partlist.part.name,
                order,
              }),
            );
          }
        }
      }
      await this.mailService.notifyNewOrder(findOrder);
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
    } else if (
      user.role === UserRole.Partner &&
      order.partner.name === user.company
    ) {
      canSee = true;
    }
    return canSee;
  }

  async editOrder(
    user: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
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
    { page, take, status, classification, searchTerm }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];
      let totalResults: number;
      if (user.role === UserRole.CEN) {
        [orders, totalResults] = await this.orders.findAndCount({
          where: [
            {
              writer: user,
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              writer: user,
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              salesPerson: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              writer: user,
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              destination: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
          ],
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['partner'],
        });
      } else if (user.role === UserRole.CENSE) {
        [orders, totalResults] = await this.orders.findAndCount({
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          where: [
            {
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              salesPerson: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              destination: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
          ],
          relations: ['partner'],
        });
      } else if (user.role === UserRole.Partner) {
        const partner = await this.partners.findOne({ name: user.company });
        if (!user.orderAuth) {
          return {
            ok: false,
            error: '권한이 없습니다. 관리자에게 문의해주세요.',
          };
        }
        if (!partner) {
          return {
            ok: false,
            error: '등록된 출고기록이 없습니다.',
          };
        }
        [orders, totalResults] = await this.orders.findAndCount({
          where: [
            {
              partner,
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              projectName: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              partner,
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              salesPerson: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
            {
              partner,
              ...(status === OrderStatus.Completed && { status }),
              ...(status === OrderStatus.Notcompleted && {
                status: Not(OrderStatus.Completed),
              }),
              ...(classification && { classification }),
              destination: searchTerm ? ILike(`%${searchTerm}%`) : ILike(`%`),
            },
          ],
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['partner'],
        });
      }
      return {
        ok: true,
        orders,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
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
      let order: Order;
      if (user.role === UserRole.Partner) {
        const partner = await this.partners.findOne({ name: user.company });
        if (!user.orderAuth) {
          return {
            ok: false,
            error: '권한이 없습니다. 관리자에게 문의해주세요.',
          };
        }
        if (!partner) {
          return {
            ok: false,
            error: '등록된 출고기록이 없습니다.',
          };
        }
        order = await this.orders.findOne(orderId, {
          where: {
            partner,
          },
          relations: ['writer', 'partner', 'items', 'items.bundle'],
        });
      }
      if (user.role !== UserRole.Partner) {
        order = await this.orders.findOne(orderId, {
          relations: ['writer', 'partner', 'items', 'items.bundle'],
        });
      }
      if (!order) {
        return {
          ok: false,
          error: '존재하지 않는 출고요청서 입니다.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: '권한이 없습니다.',
        };
      }
      return {
        ok: true,
        order,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '출고요청서를 불러올 수 없습니다.',
      };
    }
  }

  async getOrderItems(
    user: User,
    { orderId, page, take }: GetOrderItemsInput,
  ): Promise<GetOrderItemsOutput> {
    try {
      if (
        user.role === UserRole.CENSE ||
        user.role === UserRole.CEN ||
        user.role === UserRole.Partner
      ) {
        const [itemInfos, totalResults] = await this.itemInfos.findAndCount({
          where: {
            order: orderId,
          },
          skip: (page - 1) * take,
          take,
          order: { id: 'ASC' },
        });
        if (!itemInfos || itemInfos.length === 0) {
          return {
            ok: false,
            error: '제품 정보가 존재하지 않습니다.',
          };
        }
        return {
          ok: true,
          itemInfos,
          totalPages: Math.ceil(totalResults / take),
          totalResults,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '제품 정보를 불러올 수 없습니다.',
      };
    }
  }
}
