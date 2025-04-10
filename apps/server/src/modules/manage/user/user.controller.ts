import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { PageUserDto, SearchUserDto } from './dto/search-user.dto';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/edit-user.dto';
import { GrantUserDto, RevokeUserDto } from './dto/grant-user.dto';

@Controller('/v1/manage/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  async list(@Query() searchUserDto: SearchUserDto) {
    return this.userService.list(searchUserDto);
  }

  @Get('/page')
  async page(@Query() pageUserDto: PageUserDto) {
    return this.userService.page(pageUserDto);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.userService.detail(id);
  }

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }

  @Post('/update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(updateUserDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.userService.delete(id);
  }

  @Post('/updatePassword')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    await this.userService.updatePassword(updatePasswordDto);
  }

  @Post('/grant')
  async grant(@Body() grantUserDto: GrantUserDto) {
    await this.userService.grant(grantUserDto);
  }

  @Post('/revoke')
  async revoke(@Body() revokeUserDto: RevokeUserDto) {
    await this.userService.revoke(revokeUserDto);
  }
}
