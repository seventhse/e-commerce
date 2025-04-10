import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DistributionService } from './distribution.service';
import { CreateDistributionDto } from './dto/create-distribution.dto';
import { UpdateDistributionDto } from './dto/update-distribution.dto';
import {
  PageDistributionDto,
  SearchDistributionDto,
} from './dto/search-distribution.dto';

@ApiTags('分销管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/distributions')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @ApiOperation({ summary: '获取分销列表' })
  @ApiResponse({ status: 200, description: '成功获取分销列表' })
  @Get('/list')
  async list(@Query() searchDistributionDto: SearchDistributionDto) {
    return this.distributionService.list(searchDistributionDto);
  }

  @ApiOperation({ summary: '分页获取分销列表' })
  @ApiResponse({ status: 200, description: '成功获取分销分页数据' })
  @Get('/page')
  async page(@Query() pageDistributionDto: PageDistributionDto) {
    return this.distributionService.page(pageDistributionDto);
  }

  @ApiOperation({ summary: '获取分销详情' })
  @ApiResponse({ status: 200, description: '成功获取分销详情' })
  @ApiResponse({ status: 404, description: '分销不存在' })
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.distributionService.detail(id);
  }

  @ApiOperation({ summary: '创建分销' })
  @ApiResponse({ status: 200, description: '分销创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createDistributionDto: CreateDistributionDto) {
    await this.distributionService.create(createDistributionDto);
  }

  @ApiOperation({ summary: '更新分销' })
  @ApiResponse({ status: 200, description: '分销更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '分销不存在' })
  @Post('/update')
  async update(@Body() updateDistributionDto: UpdateDistributionDto) {
    await this.distributionService.update(
      updateDistributionDto.id,
      updateDistributionDto,
    );
  }

  @ApiOperation({ summary: '删除分销' })
  @ApiResponse({ status: 200, description: '分销删除成功' })
  @ApiResponse({ status: 404, description: '分销不存在' })
  @ApiResponse({ status: 400, description: '删除分销失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.distributionService.delete(id);
  }
}
