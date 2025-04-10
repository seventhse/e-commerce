import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommodityService } from './commodity.service';
import {
  PageCommodityDto,
  SearchCommodityDto,
} from './dto/search-commodity.dto';
import {
  CreateCommodityDto,
  UpdateCommodityDto,
} from './dto/edit-commodity.dto';

@Controller('/v1/manage/commodity')
export class CommodityController {
  constructor(private commodityService: CommodityService) {}

  @Get('/list')
  async findAll(@Query() searchDto: SearchCommodityDto) {
    return this.commodityService.findAll(searchDto);
  }

  @Get('/page')
  async findPage(@Query() pageDto: PageCommodityDto) {
    return this.commodityService.findPage(pageDto);
  }

  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.commodityService.findOne(id);
  }

  @Post('/create')
  async create(@Body() createDto: CreateCommodityDto) {
    return await this.commodityService.create(createDto);
  }

  @Post('/update')
  async update(@Body() updateDto: UpdateCommodityDto) {
    return await this.commodityService.update(updateDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    return await this.commodityService.delete(id);
  }
}
