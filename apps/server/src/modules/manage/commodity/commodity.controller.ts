import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommodityService } from './commodity.service';
import {
  PageCommodityDto,
  SearchCommodityDto,
} from './dto/search-commodity.dto';
import {
  CreateCommodityDto,
  UpdateCommodityDto,
} from './dto/edit-commodity.dto';

@ApiTags('商品管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/commodity')
export class CommodityController {
  constructor(private commodityService: CommodityService) {}

  @ApiOperation({ summary: '获取商品列表' })
  @ApiResponse({ status: 200, description: '成功获取商品列表' })
  @Get('/list')
  async findAll(@Query() searchDto: SearchCommodityDto) {
    return this.commodityService.findAll(searchDto);
  }

  @ApiOperation({ summary: '分页获取商品列表' })
  @ApiResponse({ status: 200, description: '成功获取商品分页数据' })
  @Get('/page')
  async findPage(@Query() pageDto: PageCommodityDto) {
    return this.commodityService.findPage(pageDto);
  }

  @ApiOperation({ summary: '获取商品详情' })
  @ApiResponse({ status: 200, description: '成功获取商品详情' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.commodityService.findOne(id);
  }

  @ApiOperation({ summary: '创建商品' })
  @ApiResponse({ status: 200, description: '商品创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createDto: CreateCommodityDto) {
    return await this.commodityService.create(createDto);
  }

  @ApiOperation({ summary: '更新商品' })
  @ApiResponse({ status: 200, description: '商品更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  @Post('/update')
  async update(@Body() updateDto: UpdateCommodityDto) {
    return await this.commodityService.update(updateDto);
  }

  @ApiOperation({ summary: '删除商品' })
  @ApiResponse({ status: 200, description: '商品删除成功' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  @ApiResponse({ status: 500, description: '删除商品失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    return await this.commodityService.delete(id);
  }
}
