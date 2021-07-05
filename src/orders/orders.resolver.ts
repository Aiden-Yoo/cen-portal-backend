import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { DeleteOrderInput, DeleteOrderOutput } from './dtos/delete-order.dto';
import { EditItemInfoInput, EditItemInfoOutput } from './dtos/edit-item.dto';
import { EditOPrderOutput, EditOrderInput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import {
  GetOrderItemsInput,
  GetOrderItemsOutput,
} from './dtos/get-orderItems.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';

@Resolver(of => Order)
export class OrderResolver {
  constructor(private readonly ordersService: OrderService) {}

  @Mutation(returns => CreateOrderOutput)
  @Role(['CENSE', 'CEN'])
  async createOrder(
    @AuthUser() writer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(writer, createOrderInput);
  }

  @Mutation(returns => EditOPrderOutput)
  @Role(['CENSE', 'CEN'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input')
    editOrderInput: EditOrderInput,
  ): Promise<EditOPrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Mutation(returns => DeleteOrderOutput)
  @Role(['CENSE'])
  async deleteOrder(
    @AuthUser() user: User,
    @Args('input')
    deleteOrderInput: DeleteOrderInput,
  ): Promise<DeleteOrderOutput> {
    return this.ordersService.deleteOrder(user, deleteOrderInput);
  }

  @Mutation(returns => EditItemInfoOutput)
  @Role(['CENSE'])
  async editItemInfo(
    @Args('input')
    editItemInfoInput: EditItemInfoInput,
  ): Promise<EditItemInfoOutput> {
    return this.ordersService.editItemInfo(editItemInfoInput);
  }

  @Query(returns => GetOrdersOutput)
  @Role(['CENSE', 'CEN', 'Partner'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query(returns => GetOrderOutput)
  @Role(['CENSE', 'CEN', 'Partner'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Query(returns => GetOrderItemsOutput)
  @Role(['CENSE', 'CEN', 'Partner'])
  async getOrderItems(
    @AuthUser() user: User,
    @Args('input') getOrderItemsInput: GetOrderItemsInput,
  ): Promise<GetOrderItemsOutput> {
    return this.ordersService.getOrderItems(user, getOrderItemsInput);
  }
}
