import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PageAddressDto, SearchAddressDto } from './dto/search-address.dto';

@ApiTags('地址管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: '获取地址列表' })
  @ApiResponse({ status: 200, description: '成功获取地址列表' })
  @Get('/list')
  async list(@Query() searchAddressDto: SearchAddressDto) {
    return this.addressService.list(searchAddressDto);
  }

  @ApiOperation({ summary: '分页获取地址列表' })
  @ApiResponse({ status: 200, description: '成功获取地址分页数据' })
  @Get('/page')
  async page(@Query() pageAddressDto: PageAddressDto) {
    return this.addressService.page(pageAddressDto);
  }

  @ApiOperation({ summary: '获取地址详情' })
  @ApiResponse({ status: 200, description: '成功获取地址详情' })
  @ApiResponse({ status: 404, description: '地址不存在' })
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.addressService.detail(id);
  }

  @ApiOperation({ summary: '创建地址' })
  @ApiResponse({ status: 200, description: '地址创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createAddressDto: CreateAddressDto) {
    await this.addressService.create(createAddressDto);
  }

  @ApiOperation({ summary: '更新地址' })
  @ApiResponse({ status: 200, description: '地址更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '地址不存在' })
  @Post('/update')
  async update(@Body() updateAddressDto: UpdateAddressDto) {
    await this.addressService.update(updateAddressDto.id, updateAddressDto);
  }

  @ApiOperation({ summary: '删除地址' })
  @ApiResponse({ status: 200, description: '地址删除成功' })
  @ApiResponse({ status: 404, description: '地址不存在' })
  @ApiResponse({ status: 400, description: '删除地址失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.addressService.delete(id);
  }
}
