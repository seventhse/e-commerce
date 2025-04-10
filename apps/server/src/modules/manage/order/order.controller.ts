import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { PageOrderDto, SearchOrderDto } from './dto/search-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('订单管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '获取订单列表' })
  @ApiResponse({ status: 200, description: '成功获取订单列表' })
  @Get('/list')
  async list(@Query() searchOrderDto: SearchOrderDto) {
    return this.orderService.list(searchOrderDto);
  }

  @ApiOperation({ summary: '分页获取订单列表' })
  @ApiResponse({ status: 200, description: '成功获取订单分页数据' })
  @Get('/page')
  async page(@Query() pageOrderDto: PageOrderDto) {
    return this.orderService.page(pageOrderDto);
  }

  @ApiOperation({ summary: '获取订单详情' })
  @ApiResponse({ status: 200, description: '成功获取订单详情' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.orderService.detail(id);
  }

  @ApiOperation({ summary: '创建订单' })
  @ApiResponse({ status: 200, description: '订单创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    await this.orderService.create(createOrderDto);
  }

  @ApiOperation({ summary: '更新订单' })
  @ApiResponse({ status: 200, description: '订单更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  @Post('/update')
  async update(@Body() updateOrderDto: UpdateOrderDto) {
    await this.orderService.update(updateOrderDto.id, updateOrderDto);
  }

  @ApiOperation({ summary: '删除订单' })
  @ApiResponse({ status: 200, description: '订单删除成功' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  @ApiResponse({ status: 400, description: '删除订单失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.orderService.delete(id);
  }
}
