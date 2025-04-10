import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { PageUserDto, SearchUserDto } from './dto/search-user.dto';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/edit-user.dto';
import { GrantUserDto, RevokeUserDto } from './dto/grant-user.dto';

@ApiTags('用户管理')
@ApiBearerAuth('JWT-auth')
@Controller('/v1/manage/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: 200, description: '成功获取用户列表' })
  @Get('/list')
  async list(@Query() searchUserDto: SearchUserDto) {
    return this.userService.list(searchUserDto);
  }

  @ApiOperation({ summary: '分页获取用户列表' })
  @ApiResponse({ status: 200, description: '成功获取用户分页数据' })
  @Get('/page')
  async page(@Query() pageUserDto: PageUserDto) {
    return this.userService.page(pageUserDto);
  }

  @ApiOperation({ summary: '获取用户详情' })
  @ApiResponse({ status: 200, description: '成功获取用户详情' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.userService.detail(id);
  }

  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 200, description: '用户创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiResponse({ status: 200, description: '用户更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Post('/update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '用户删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 400, description: '删除用户失败' })
  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.userService.delete(id);
  }

  @ApiOperation({ summary: '更新用户密码' })
  @ApiResponse({ status: 200, description: '密码更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Post('/updatePassword')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    await this.userService.updatePassword(updatePasswordDto);
  }

  @ApiOperation({ summary: '授予用户角色' })
  @ApiResponse({ status: 200, description: '授权成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户或角色不存在' })
  @Post('/grant')
  async grant(@Body() grantUserDto: GrantUserDto) {
    await this.userService.grant(grantUserDto);
  }

  @ApiOperation({ summary: '撤销用户角色' })
  @ApiResponse({ status: 200, description: '撤销授权成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户或角色不存在' })
  @Post('/revoke')
  async revoke(@Body() revokeUserDto: RevokeUserDto) {
    await this.userService.revoke(revokeUserDto);
  }
}
