import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BusinessException } from '~/common/exceptions/business.exception';
import { LoggerService } from '~/common/logger/logger.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PageOrderDto, SearchOrderDto } from './dto/search-order.dto';

function buildOrderWhere(searchOrderDto: SearchOrderDto) {
  const where: Prisma.OrderWhereInput = {};

  if (searchOrderDto.orderNumber) {
    where.orderNumber = {
      contains: searchOrderDto.orderNumber,
      mode: 'insensitive',
    };
  }
  if (searchOrderDto.consumerId) {
    where.consumerId = searchOrderDto.consumerId;
  }
  if (searchOrderDto.addressId) {
    where.addressId = searchOrderDto.addressId;
  }
  if (searchOrderDto.status) {
    where.status = searchOrderDto.status;
  }
  return where;
}

const include = {
  consumer: true,
  address: true,
  orderItems: true,
};

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(OrderService.name);
  }

  async list(searchOrderDto: SearchOrderDto) {
    this.logger.debug(
      `Finding orders with filters \\n ${JSON.stringify(searchOrderDto, null, 2)}`,
    );
    const orders = await this.prisma.order.findMany({
      where: buildOrderWhere(searchOrderDto),
      orderBy: {
        createdAt: 'desc',
      },
      include,
    });
    this.logger.debug(JSON.stringify(orders, null, 2));
    this.logger.debug(`Found ${orders.length} orders`);
    return orders;
  }

  async page({ page, pageSize, ...search }: PageOrderDto) {
    this.logger.debug(
      `Paginating orders \\n ${JSON.stringify({ page, pageSize, ...search }, null, 2)}`,
    );
    const where = buildOrderWhere(search);

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        include,
      }),
      this.prisma.order.count({ where }),
    ]);

    this.logger.debug(`Found ${orders.length} orders, total: ${total}`);
    return {
      records: orders,
      total,
      page,
      pageSize,
    };
  }

  async detail(id: string) {
    this.logger.debug(`Finding order details for id: ${id}`);
    const order = await this.prisma.order.findUnique({
      where: { id },
      include,
    });
    if (!order) {
      this.logger.debug(`Order not found with id: ${id}`);
      return null;
    }
    this.logger.debug(`Found order: ${order.orderNumber}`);
    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    this.logger.debug(`Creating order: ${createOrderDto.orderNumber}`);
    return this.prisma.order.create({ data: createOrderDto });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    this.logger.debug(`Updating order: ${id}`);
    const res = await this.prisma.order.findUnique({ where: { id } });
    if (!res) {
      throw new BusinessException(400, '订单不存在，请刷新查看最新数据.');
    }
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async delete(id: string) {
    this.logger.debug(`Deleting order: ${id}`);
    return this.prisma.order.delete({ where: { id } });
  }
}