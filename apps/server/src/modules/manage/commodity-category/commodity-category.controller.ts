import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommodityCategoryService } from './commodity-category.service';
import {
  PageCommodityCategoryDto,
  SearchCommodityCategoryDto,
} from './dto/search-commodity-category.dto';
import {
  CreateCommodityCategoryDto,
  UpdateCommodityCategoryDto,
} from './dto/edit-commodity-category.dto';

@Controller('/v1/manage/commodity-category')
export class CommodityCategoryController {
  constructor(private commodityCategoryService: CommodityCategoryService) {}

  @Get('/list')
  async findAll(@Query() searchDto: SearchCommodityCategoryDto) {
    return this.commodityCategoryService.findAll(searchDto);
  }

  @Get('/page')
  async findPage(@Query() pageDto: PageCommodityCategoryDto) {
    return this.commodityCategoryService.findPage(pageDto);
  }

  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.commodityCategoryService.findOne(id);
  }

  @Post('/create')
  async create(@Body() createDto: CreateCommodityCategoryDto) {
    await this.commodityCategoryService.create(createDto);
  }

  @Post('/update')
  async update(@Body() updateDto: UpdateCommodityCategoryDto) {
    await this.commodityCategoryService.update(updateDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.commodityCategoryService.delete(id);
  }
}
