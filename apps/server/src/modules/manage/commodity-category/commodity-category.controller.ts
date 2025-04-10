import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommodityCategoryService } from './commodity-category.service';
import {
  PageCommodityCategoryDto,
  SearchCommodityCategoryDto,
} from './dto/search-commodity-category.dto';
import {
  CreateCommodityCategoryDto,
  UpdateCommodityCategoryDto,
} from './dto/edit-commodity-category.dto';

@ApiTags('商品分类管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/commodity-category')
export class CommodityCategoryController {
  constructor(private commodityCategoryService: CommodityCategoryService) {}

  @ApiOperation({ summary: '获取商品分类列表' })
  @ApiResponse({ status: 200, description: '成功获取商品分类列表' })
  @Get('/list')
  async findAll(@Query() searchDto: SearchCommodityCategoryDto) {
    return this.commodityCategoryService.findAll(searchDto);
  }

  @ApiOperation({ summary: '分页获取商品分类列表' })
  @ApiResponse({ status: 200, description: '成功获取商品分类分页数据' })
  @Get('/page')
  async findPage(@Query() pageDto: PageCommodityCategoryDto) {
    return this.commodityCategoryService.findPage(pageDto);
  }

  @ApiOperation({ summary: '获取商品分类详情' })
  @ApiResponse({ status: 200, description: '成功获取商品分类详情' })
  @ApiResponse({ status: 404, description: '商品分类不存在' })
  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.commodityCategoryService.findOne(id);
  }

  @ApiOperation({ summary: '创建商品分类' })
  @ApiResponse({ status: 200, description: '商品分类创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createDto: CreateCommodityCategoryDto) {
    await this.commodityCategoryService.create(createDto);
  }

  @ApiOperation({ summary: '更新商品分类' })
  @ApiResponse({ status: 200, description: '商品分类更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '商品分类不存在' })
  @Post('/update')
  async update(@Body() updateDto: UpdateCommodityCategoryDto) {
    await this.commodityCategoryService.update(updateDto);
  }

  @ApiOperation({ summary: '删除商品分类' })
  @ApiResponse({ status: 200, description: '商品分类删除成功' })
  @ApiResponse({ status: 404, description: '商品分类不存在' })
  @ApiResponse({ status: 400, description: '删除商品分类失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.commodityCategoryService.delete(id);
  }
}
