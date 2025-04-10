import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PageCartItemDto, SearchCartItemDto } from './dto/search-cart-item.dto';

@ApiTags('购物车管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @ApiOperation({ summary: '获取购物车列表' })
  @ApiResponse({ status: 200, description: '成功获取购物车列表' })
  @Get('/list')
  async list(@Query() searchCartItemDto: SearchCartItemDto) {
    return this.cartItemService.list(searchCartItemDto);
  }

  @ApiOperation({ summary: '分页获取购物车列表' })
  @ApiResponse({ status: 200, description: '成功获取购物车分页数据' })
  @Get('/page')
  async page(@Query() pageCartItemDto: PageCartItemDto) {
    return this.cartItemService.page(pageCartItemDto);
  }

  @ApiOperation({ summary: '获取购物车项详情' })
  @ApiResponse({ status: 200, description: '成功获取购物车项详情' })
  @ApiResponse({ status: 404, description: '购物车项不存在' })
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.cartItemService.detail(id);
  }

  @ApiOperation({ summary: '创建购物车项' })
  @ApiResponse({ status: 200, description: '购物车项创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createCartItemDto: CreateCartItemDto) {
    await this.cartItemService.create(createCartItemDto);
  }

  @ApiOperation({ summary: '更新购物车项' })
  @ApiResponse({ status: 200, description: '购物车项更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '购物车项不存在' })
  @Post('/update')
  async update(@Body() updateCartItemDto: UpdateCartItemDto) {
    await this.cartItemService.update(updateCartItemDto.id, updateCartItemDto);
  }

  @ApiOperation({ summary: '删除购物车项' })
  @ApiResponse({ status: 200, description: '购物车项删除成功' })
  @ApiResponse({ status: 404, description: '购物车项不存在' })
  @ApiResponse({ status: 400, description: '删除购物车项失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.cartItemService.delete(id);
  }
}
