import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { PageRoleDto, SearchRoleDto } from './dto/search-role.dto';
import { RolePermissionDto } from './dto/grant-role.dto';

@ApiTags('角色管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '获取角色列表' })
  @ApiResponse({ status: 200, description: '成功获取角色列表' })
  @Get('/list')
  async findAll(@Query() searchRoleDto: SearchRoleDto) {
    return await this.roleService.findAll(searchRoleDto);
  }

  @ApiOperation({ summary: '分页获取角色列表' })
  @ApiResponse({ status: 200, description: '成功获取角色分页数据' })
  @Get('/page')
  async findAllByPage(@Query() pageRoleDto: PageRoleDto) {
    return this.roleService.findAllByPage(pageRoleDto);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @ApiResponse({ status: 200, description: '成功获取角色详情' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 200, description: '角色创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    await this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiResponse({ status: 200, description: '角色更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @Post('/update')
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    await this.roleService.update(updateRoleDto);
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '角色删除成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 400, description: '删除角色失败' })
  @Post('/delete')
  async remove(@Body('id') id: string) {
    await this.roleService.remove(id);
  }

  @ApiOperation({ summary: '授予角色权限' })
  @ApiResponse({ status: 200, description: '授权成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '角色或权限不存在' })
  @Post('/grant')
  async grant(@Body() rolePermissionDto: RolePermissionDto) {
    await this.roleService.grant(rolePermissionDto);
  }

  @ApiOperation({ summary: '撤销角色权限' })
  @ApiResponse({ status: 200, description: '撤销授权成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '角色或权限不存在' })
  @Post('/revoke')
  async revoke(@Body() rolePermissionDto: RolePermissionDto) {
    await this.roleService.revoke(rolePermissionDto);
  }
}
