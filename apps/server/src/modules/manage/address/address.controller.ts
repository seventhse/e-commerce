import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PageAddressDto, SearchAddressDto } from './dto/search-address.dto';

@Controller('/v1/manage/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/list')
  async list(@Query() searchAddressDto: SearchAddressDto) {
    return this.addressService.list(searchAddressDto);
  }

  @Get('/page')
  async page(@Query() pageAddressDto: PageAddressDto) {
    return this.addressService.page(pageAddressDto);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.addressService.detail(id);
  }

  @Post('/create')
  async create(@Body() createAddressDto: CreateAddressDto) {
    await this.addressService.create(createAddressDto);
  }

  @Post('/update')
  async update(@Body() updateAddressDto: UpdateAddressDto) {
    await this.addressService.update(updateAddressDto.id, updateAddressDto);
  }

  @Post('/delete')
  async delete(@Body('id') id: string) {
    await this.addressService.delete(id);
  }
}
