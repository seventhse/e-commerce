import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { PageRoleDto, SearchRoleDto } from './dto/search-role.dto';
import { RolePermissionDto } from './dto/grant-role.dto';

@Controller('/v1/manage/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/list')
  async findAll(@Query() searchRoleDto: SearchRoleDto) {
    return await this.roleService.findAll(searchRoleDto);
  }

  @Get('/page')
  async findAllByPage(@Query() pageRoleDto: PageRoleDto) {
    return this.roleService.findAllByPage(pageRoleDto);
  }

  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    await this.roleService.create(createRoleDto);
  }

  @Post('/update')
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    await this.roleService.update(updateRoleDto);
  }

  @Post('/delete')
  async remove(@Body('id') id: string) {
    await this.roleService.remove(id);
  }

  @Post('/grant')
  async grant(@Body() rolePermissionDto: RolePermissionDto) {
    await this.roleService.grant(rolePermissionDto);
  }

  @Post('/revoke')
  async revoke(@Body() rolePermissionDto: RolePermissionDto) {
    await this.roleService.revoke(rolePermissionDto);
  }
}
