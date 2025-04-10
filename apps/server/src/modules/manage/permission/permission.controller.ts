import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import {
  PagePermissionDto,
  SearchPermissionDto,
} from './dto/search-permission.dto';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto/edit-permission.dto';

@ApiTags('权限管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @ApiOperation({ summary: '获取权限列表' })
  @ApiResponse({ status: 200, description: '成功获取权限列表' })
  @Get('/list')
  async findAll(@Query() searchDto: SearchPermissionDto) {
    return this.permissionService.findAll(searchDto);
  }

  @ApiOperation({ summary: '分页获取权限列表' })
  @ApiResponse({ status: 200, description: '成功获取权限分页数据' })
  @Get('/page')
  async findPage(@Query() pageDto: PagePermissionDto) {
    return this.permissionService.findPage(pageDto);
  }

  @ApiOperation({ summary: '获取权限详情' })
  @ApiResponse({ status: 200, description: '成功获取权限详情' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 200, description: '权限创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createDto: CreatePermissionDto) {
    await this.permissionService.create(createDto);
  }

  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: 200, description: '权限更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @Post('/update')
  async update(@Body() updateDto: UpdatePermissionDto) {
    await this.permissionService.update(updateDto);
  }

  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '权限删除成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 400, description: '删除权限失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.permissionService.delete(id);
  }

  @ApiOperation({ summary: '获取角色权限' })
  @ApiResponse({ status: 200, description: '成功获取角色权限' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @Get('/rolePermissions/:roleId')
  async getRolePermissions(@Param('roleId') roleId: string) {
    return this.permissionService.getRolePermissions(roleId);
  }
}
