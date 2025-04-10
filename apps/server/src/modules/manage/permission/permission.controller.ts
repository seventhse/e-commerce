import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import {
  PagePermissionDto,
  SearchPermissionDto,
} from './dto/search-permission.dto';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto/edit-permission.dto';

@Controller('/v1/manage/permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('/list')
  async findAll(@Query() searchDto: SearchPermissionDto) {
    return this.permissionService.findAll(searchDto);
  }

  @Get('/page')
  async findPage(@Query() pageDto: PagePermissionDto) {
    return this.permissionService.findPage(pageDto);
  }

  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Post('/create')
  async create(@Body() createDto: CreatePermissionDto) {
    await this.permissionService.create(createDto);
  }

  @Post('/update')
  async update(@Body() updateDto: UpdatePermissionDto) {
    await this.permissionService.update(updateDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.permissionService.delete(id);
  }

  @Get('/rolePermissions/:roleId')
  async getRolePermissions(@Param('roleId') roleId: string) {
    return this.permissionService.getRolePermissions(roleId);
  }
}
