import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import {
  PageOrderItemDto,
  SearchOrderItemDto,
} from './dto/search-order-item.dto';

@ApiTags('订单项管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @ApiOperation({ summary: '获取订单项列表' })
  @ApiResponse({ status: 200, description: '成功获取订单项列表' })
  @Get('/list')
  async list(@Query() searchOrderItemDto: SearchOrderItemDto) {
    return this.orderItemService.list(searchOrderItemDto);
  }

  @ApiOperation({ summary: '分页获取订单项列表' })
  @ApiResponse({ status: 200, description: '成功获取订单项分页数据' })
  @Get('/page')
  async page(@Query() pageOrderItemDto: PageOrderItemDto) {
    return this.orderItemService.page(pageOrderItemDto);
  }

  @ApiOperation({ summary: '获取订单项详情' })
  @ApiResponse({ status: 200, description: '成功获取订单项详情' })
  @ApiResponse({ status: 404, description: '订单项不存在' })
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.orderItemService.detail(id);
  }

  @ApiOperation({ summary: '创建订单项' })
  @ApiResponse({ status: 200, description: '订单项创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    await this.orderItemService.create(createOrderItemDto);
  }

  @ApiOperation({ summary: '更新订单项' })
  @ApiResponse({ status: 200, description: '订单项更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '订单项不存在' })
  @Post('/update')
  async update(@Body() updateOrderItemDto: UpdateOrderItemDto) {
    await this.orderItemService.update(
      updateOrderItemDto.id,
      updateOrderItemDto,
    );
  }

  @ApiOperation({ summary: '删除订单项' })
  @ApiResponse({ status: 200, description: '订单项删除成功' })
  @ApiResponse({ status: 404, description: '订单项不存在' })
  @ApiResponse({ status: 400, description: '删除订单项失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.orderItemService.delete(id);
  }
}
