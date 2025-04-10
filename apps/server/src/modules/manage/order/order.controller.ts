import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PageOrderDto, SearchOrderDto } from './dto/search-order.dto';
import { CreateOrderDto, UpdateOrderDto } from './dto/edit-order.dto';

@Controller('/v1/manage/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/list')
  async list(@Query() searchOrderDto: SearchOrderDto) {
    return this.orderService.list(searchOrderDto);
  }

  @Get('/page')
  async page(@Query() pageOrderDto: PageOrderDto) {
    return this.orderService.page(pageOrderDto);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.orderService.detail(id);
  }

  @Post('/create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    await this.orderService.create(createOrderDto);
  }

  @Post('/update')
  async update(@Body() updateOrderDto: UpdateOrderDto) {
    await this.orderService.update(updateOrderDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.orderService.delete(id);
  }
}