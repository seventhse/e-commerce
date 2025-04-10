import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessException } from '~/common/exceptions/business.exception';
import { LoggerService } from '~/common/logger/logger.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { PageAddressDto, SearchAddressDto } from './dto/search-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

function buildAddressWhere(searchAddressDto: SearchAddressDto) {
  const where: Prisma.AddressWhereInput = {};
  if (searchAddressDto.consumerId) {
    where.consumerId = searchAddressDto.consumerId;
  }
  if (searchAddressDto.province) {
    where.province = {
      contains: searchAddressDto.province,
      mode: 'insensitive',
    };
  }
  if (searchAddressDto.city) {
    where.city = { contains: searchAddressDto.city, mode: 'insensitive' };
  }
  if (searchAddressDto.district) {
    where.district = {
      contains: searchAddressDto.district,
      mode: 'insensitive',
    };
  }
  return where;
}

@Injectable()
export class AddressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AddressService.name);
  }

  async list(searchAddressDto: SearchAddressDto) {
    this.logger.debug(
      `Finding addresss with filters \n ${JSON.stringify(
        searchAddressDto,
        null,
        2,
      )}`,
    );
    const addresss = await this.prisma.address.findMany({
      where: buildAddressWhere(searchAddressDto),
      orderBy: {
        createdAt: 'desc',
      },
    });
    this.logger.debug(`Found ${addresss.length} addresss`);
    return addresss;
  }

  async page({ page, pageSize, ...search }: PageAddressDto) {
    this.logger.debug(
      `Paginating addresss \n ${JSON.stringify({
        page,
        pageSize,
        ...search,
      }, null, 2)}`,
    );
    const where = buildAddressWhere(search);
    const [addresss, total] = await Promise.all([
      this.prisma.address.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.address.count({
        where,
      }),
    ]);
    this.logger.debug(`Found ${addresss.length} addresss, total: ${total}`);
    return { records: addresss, total, page, pageSize };
  }

  async detail(id: string) {
    this.logger.debug(`Finding address details for id: ${id}`);
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) {
      this.logger.debug(`address not found with id: ${id}`);
      throw new BusinessException(400, '地址不存在');
    }
    return address;
  }

  async create(createAddressDto: CreateAddressDto) {
    this.logger.debug(`Creating new address \n ${JSON.stringify(createAddressDto, null, 2)}`);
    return this.prisma.address.create({ data: createAddressDto });
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    this.logger.debug(`Updating address with id: ${id} \n ${JSON.stringify(updateAddressDto, null, 2)}`);
    await this.detail(id);
    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async delete(id: string) {
    this.logger.debug(`Deleting address with id: ${id}`);
    await this.detail(id);
    return this.prisma.address.delete({ where: { id } });
  }
}