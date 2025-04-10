import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto/edit-order-item.dto';
import { PageOrderItemDto, SearchOrderItemDto } from './dto/search-order-item.dto';

@Controller('/v1/manage/order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get('/list')
  async list(@Query() searchOrderItemDto: SearchOrderItemDto) {
    return this.orderItemService.list(searchOrderItemDto);
  }

  @Get('/page')
  async page(@Query() pageOrderItemDto: PageOrderItemDto) {
    return this.orderItemService.page(pageOrderItemDto);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.orderItemService.detail(id);
  }

  @Post('/create')
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    await this.orderItemService.create(createOrderItemDto);
  }

  @Post('/update')
  async update(@Body() updateOrderItemDto: UpdateOrderItemDto) {
    await this.orderItemService.update(updateOrderItemDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.orderItemService.delete(id);
  }
}