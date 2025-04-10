import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { PageConsumerDto, SearchConsumerDto } from './dto/search-consumer.dto';

@Controller('/v1/manage/consumers')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get('/list')
  async list(@Query() searchConsumerDto: SearchConsumerDto) {
    return this.consumerService.list(searchConsumerDto);
  }

  @Get('/page')
  async page(@Query() pageConsumerDto: PageConsumerDto) {
    return this.consumerService.page(pageConsumerDto);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.consumerService.detail(id);
  }

  @Post('/create')
  async create(@Body() createConsumerDto: CreateConsumerDto) {
    await this.consumerService.create(createConsumerDto);
  }

  @Post('/update')
  async update(@Body() updateConsumerDto: UpdateConsumerDto) {
    await this.consumerService.update(updateConsumerDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.consumerService.delete(id);
  }

  // @Post('/grant')
  // async grant(@Body() grantConsumerDto: GrantConsumerDto) {
  //   await this.consumerService.grant(grantConsumerDto);
  // }
}
