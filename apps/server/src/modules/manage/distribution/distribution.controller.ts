import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { CreateDistributionDto } from './dto/create-distribution.dto';
import { UpdateDistributionDto } from './dto/update-distribution.dto';
import {
  PageDistributionDto,
  SearchDistributionDto,
} from './dto/search-distribution.dto';

@Controller('/v1/manage/distributions')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @Get('/list')
  async list(@Query() searchDistributionDto: SearchDistributionDto) {
    return this.distributionService.list(searchDistributionDto);
  }

  @Get('/page')
  async page(@Query() pageDistributionDto: PageDistributionDto) {
    return this.distributionService.page(pageDistributionDto);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.distributionService.detail(id);
  }

  @Post('/create')
  async create(@Body() createDistributionDto: CreateDistributionDto) {
    await this.distributionService.create(createDistributionDto);
  }

  @Post('/update')
  async update(@Body() updateDistributionDto: UpdateDistributionDto) {
    await this.distributionService.update(
      updateDistributionDto.id,
      updateDistributionDto,
    );
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.distributionService.delete(id);
  }
}
