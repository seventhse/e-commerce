import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PageCartItemDto, SearchCartItemDto } from './dto/search-cart-item.dto';

@Controller('/v1/manage/cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get('/list')
  async list(@Query() searchCartItemDto: SearchCartItemDto) {
    return this.cartItemService.list(searchCartItemDto);
  }

  @Get('/page')
  async page(@Query() pageCartItemDto: PageCartItemDto) {
    return this.cartItemService.page(pageCartItemDto);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.cartItemService.detail(id);
  }

  @Post('/create')
  async create(@Body() createCartItemDto: CreateCartItemDto) {
    await this.cartItemService.create(createCartItemDto);
  }

  @Post('/update')
  async update(@Body() updateCartItemDto: UpdateCartItemDto) {
    await this.cartItemService.update(updateCartItemDto.id, updateCartItemDto);
  }
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.cartItemService.delete(id);
  }
}
