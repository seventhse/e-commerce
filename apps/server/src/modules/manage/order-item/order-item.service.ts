import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { LoggerService } from '~/common/logger/logger.service';
import { BusinessException } from '~/common/exceptions/business.exception';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import {
  PageOrderItemDto,
  SearchOrderItemDto,
} from './dto/search-order-item.dto';

function buildOrderItemWhere(searchOrderItemDto: SearchOrderItemDto) {
  const where: Prisma.OrderItemWhereInput = {};

  if (searchOrderItemDto.orderId) {
    where.orderId = searchOrderItemDto.orderId;
  }
  if (searchOrderItemDto.commodityId) {
    where.commodityId = searchOrderItemDto.commodityId;
  }

  return where;
}

const include = {
  order: {
    select: {
      id: true,
      orderNumber: true,
    },
  },
  commodity: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class OrderItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(OrderItemService.name);
  }

  async list(searchOrderItemDto: SearchOrderItemDto) {
    this.logger.debug(
      `Finding orderItems with filters \\n ${JSON.stringify(searchOrderItemDto, null, 2)}`,
    );
    const orderItems = await this.prisma.orderItem.findMany({
      where: buildOrderItemWhere(searchOrderItemDto),
      orderBy: {
        createdAt: 'desc',
      },
      include,
    });
    this.logger.debug(JSON.stringify(orderItems, null, 2));
    this.logger.debug(`Found ${orderItems.length} orderItems`);

    return orderItems;
  }

  async page({ page, pageSize, ...search }: PageOrderItemDto) {
    this.logger.debug(
      `Paginating orderItems \\n ${JSON.stringify({ page, pageSize, ...search }, null, 2)}`,
    );
    const where = buildOrderItemWhere(search);

    const [orderItems, total] = await Promise.all([
      this.prisma.orderItem.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        include,
      }),
      this.prisma.orderItem.count({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    this.logger.debug(`Found ${orderItems.length} orderItems, total: ${total}`);
    return {
      records: orderItems,
      total: total,
      page,
      pageSize,
    };
  }

  async detail(id: string) {
    this.logger.debug(`Finding orderItem details for id: ${id}`);
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
      include,
    });

    if (orderItem) {
      this.logger.debug(`Found orderItem: ${orderItem.id}`);
    } else {
      this.logger.debug(`orderItem not found with id: ${id}`);
      return null;
    }
    return orderItem;
  }

  async create(createOrderItemDto: CreateOrderItemDto) {
    this.logger.debug(
      `Creating new orderItem \\n ${JSON.stringify(createOrderItemDto, null, 2)}`,
    );
    const orderItem = await this.prisma.orderItem.create({
      data: createOrderItemDto,
    });
    this.logger.log(`orderItem created successfully: ${orderItem.id}`);
    return orderItem;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    this.logger.debug(
      `Updating orderItem with id: ${id} \\n ${JSON.stringify(updateOrderItemDto, null, 2)}`,
    );
    const res = await this.detail(id);
    if (!res) throw new BusinessException(400, '找不到该订单项');
    return this.prisma.orderItem.update({
      where: { id },
      data: updateOrderItemDto,
    });
  }

  async delete(id: string) {
    this.logger.debug(`Deleting orderItem with id: ${id}`);
    const res = await this.detail(id);
    if (!res) throw new BusinessException(400, '找不到该订单项');
    await this.prisma.orderItem.delete({ where: { id } });
    this.logger.log(`orderItem ${id} deleted successfully`);
  }
}
