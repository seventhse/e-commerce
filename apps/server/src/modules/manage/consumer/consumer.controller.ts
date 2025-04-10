import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { PageConsumerDto, SearchConsumerDto } from './dto/search-consumer.dto';

@ApiTags('客户管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/consumers')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @ApiOperation({ summary: '获取客户列表' })
  @ApiResponse({ status: 200, description: '成功获取客户列表' })
  @Get('/list')
  async list(@Query() searchConsumerDto: SearchConsumerDto) {
    return this.consumerService.list(searchConsumerDto);
  }

  @ApiOperation({ summary: '分页获取客户列表' })
  @ApiResponse({ status: 200, description: '成功获取客户分页数据' })
  @Get('/page')
  async page(@Query() pageConsumerDto: PageConsumerDto) {
    return this.consumerService.page(pageConsumerDto);
  }

  @ApiOperation({ summary: '获取客户详情' })
  @ApiResponse({ status: 200, description: '成功获取客户详情' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.consumerService.detail(id);
  }

  @ApiOperation({ summary: '创建客户' })
  @ApiResponse({ status: 200, description: '客户创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createConsumerDto: CreateConsumerDto) {
    await this.consumerService.create(createConsumerDto);
  }

  @ApiOperation({ summary: '更新客户' })
  @ApiResponse({ status: 200, description: '客户更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  @Post('/update')
  async update(@Body() updateConsumerDto: UpdateConsumerDto) {
    await this.consumerService.update(updateConsumerDto);
  }

  @ApiOperation({ summary: '删除客户' })
  @ApiResponse({ status: 200, description: '客户删除成功' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  @ApiResponse({ status: 400, description: '删除客户失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.consumerService.delete(id);
  }

  // @Post('/grant')
  // async grant(@Body() grantConsumerDto: GrantConsumerDto) {
  //   await this.consumerService.grant(grantConsumerDto);
  // }
}
