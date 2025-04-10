import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BusinessException } from '~/common/exceptions/business.exception';
import { LoggerService } from '~/common/logger/logger.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { PageCartItemDto, SearchCartItemDto } from './dto/search-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

function buildCartItemWhere(
  searchCartItemDto: SearchCartItemDto,
): Prisma.CartItemWhereInput {
  const where: Prisma.CartItemWhereInput = {};

  if (searchCartItemDto.consumerId) {
    where.consumerId = searchCartItemDto.consumerId;
  }

  if (searchCartItemDto.commodityId) {
    where.commodityId = searchCartItemDto.commodityId;
  }
  return where;
}

const include = {
  consumer: true,
  commodity: true,
};

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CartItemService.name);
  }

  async list(searchCartItemDto: SearchCartItemDto) {
    this.logger.debug(
      `Finding cart items with filters ${JSON.stringify(searchCartItemDto)}`,
    );

    const cartItems = await this.prisma.cartItem.findMany({
      where: buildCartItemWhere(searchCartItemDto),
      orderBy: {
        createdAt: 'desc',
      },
      include,
    });

    this.logger.debug(`Found ${cartItems.length} cart items`);
    return cartItems;
  }

  async page({ page, pageSize, ...search }: PageCartItemDto) {
    this.logger.debug(
      `Paginating cart items with filters ${JSON.stringify({ page, pageSize, ...search })}`,
    );
    const where = buildCartItemWhere(search);

    const [cartItems, total] = await Promise.all([
      this.prisma.cartItem.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        include,
      }),
      this.prisma.cartItem.count({ where }),
    ]);

    this.logger.debug(`Found ${cartItems.length} cart items, total: ${total}`);
    return {
      records: cartItems,
      total,
      page,
      pageSize,
    };
  }

  async detail(id: string) {
    this.logger.debug(`Finding cart item detail for id: ${id}`);
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include,
    });

    if (!cartItem) {
      this.logger.warn(`Cart item not found with id: ${id}`);
      throw new BusinessException(404, 'Cart item not found');
    }

    this.logger.debug(`Found cart item: ${cartItem.id}`);
    return cartItem;
  }

  async create(createCartItemDto: CreateCartItemDto) {
    this.logger.debug(
      `Creating new cart item: ${JSON.stringify(createCartItemDto)}`,
    );

    await this.checkCartItemExist(createCartItemDto);

    const cartItem = await this.prisma.cartItem.create({
      data: createCartItemDto,
      include,
    });
    this.logger.log(`Cart item created successfully: ${cartItem.id}`);
    return cartItem;
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    this.logger.debug(
      `Updating cart item with id: ${id} and data: ${JSON.stringify(updateCartItemDto)}`,
    );
    await this.detail(id);

    const cartItem = await this.prisma.cartItem.update({
      where: { id },
      data: updateCartItemDto,
      include,
    });

    this.logger.log(`Cart item updated successfully: ${cartItem.id}`);
    return cartItem;
  }

  async delete(id: string) {
    this.logger.debug(`Deleting cart item with id: ${id}`);
    await this.detail(id);

    await this.prisma.cartItem.delete({ where: { id } });

    this.logger.log(`Cart item deleted successfully: ${id}`);
    return null;
  }

  private async checkCartItemExist(createCartItemDto: CreateCartItemDto) {
    const exist = await this.prisma.cartItem.findFirst({
      where: {
        consumerId: createCartItemDto.consumerId,
        commodityId: createCartItemDto.commodityId,
      },
    });
    if (exist) {
      throw new BusinessException(
        400,
        'The commodity has already existed in the cart',
      );
    }
    return true;
  }
}
