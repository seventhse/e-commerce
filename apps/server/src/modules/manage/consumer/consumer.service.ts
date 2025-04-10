import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BusinessException } from '~/common/exceptions/business.exception';
import { LoggerService } from '~/common/logger/logger.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { PageConsumerDto, SearchConsumerDto } from './dto/search-consumer.dto';

function buildConsumerWhere(
  searchConsumerDto: SearchConsumerDto,
): Prisma.ConsumerWhereInput {
  const where: Prisma.ConsumerWhereInput = {
    deletedAt: null,
  };

  if (searchConsumerDto.phone) {
    where.phone = { contains: searchConsumerDto.phone };
  }
  if (searchConsumerDto.username) {
    where.username = {
      contains: searchConsumerDto.username,
      mode: 'insensitive',
    };
  }
  return where;
}

@Injectable()
export class ConsumerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ConsumerService.name);
  }

  async list(searchConsumerDto: SearchConsumerDto) {
    this.logger.debug(
      `Finding consumers with filters \n ${JSON.stringify(searchConsumerDto, null, 2)}`,
    );
    const consumers = await this.prisma.consumer.findMany({
      where: buildConsumerWhere(searchConsumerDto),
      orderBy: {
        createdAt: 'desc',
      },
      omit: {
        password: true,
        deletedAt: true,
      },
    });
    this.logger.debug(JSON.stringify(consumers, null, 2));
    this.logger.debug(`Found ${consumers.length} consumers`);
    return consumers;
  }

  async page({ page, pageSize, ...search }: PageConsumerDto) {
    this.logger.debug(
      `Paginating consumers \n ${JSON.stringify({ page, pageSize, ...search }, null, 2)}`,
    );
    const where = buildConsumerWhere(search);

    const [consumers, total] = await Promise.all([
      this.prisma.consumer.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        omit: {
          password: true,
          deletedAt: true,
        },
      }),
      this.prisma.consumer.count({
        where,
      }),
    ]);
    this.logger.debug(`Found ${consumers.length} consumers, total: ${total}`);
    return {
      records: consumers,
      total: total,
      page,
      pageSize,
    };
  }

  async detail(id: string) {
    this.logger.debug(`Finding consumer details for id: ${id}`);
    const consumer = await this.prisma.consumer.findUnique({
      where: { id, deletedAt: null },
      omit: {
        password: true,
        deletedAt: true,
      },
    });
    if (consumer) {
      this.logger.debug(`Found consumer: ${consumer.username}`);
    } else {
      this.logger.debug(`Consumer not found with id: ${id}`);
      return null;
    }
    return consumer;
  }

  async create(createConsumerDto: CreateConsumerDto) {
    this.logger.debug(
      `Creating new consumer \n ${JSON.stringify(createConsumerDto, null, 2)}`,
    );

    await this.checkConsumerFieldsExist(createConsumerDto);
    const consumer = await this.prisma.consumer.create({
      data: createConsumerDto,
    });
    this.logger.log(`Consumer created successfully: ${consumer.id}`);
    return null;
  }

  async update({ id, ...updateConsumerDto }: UpdateConsumerDto) {
    this.logger.debug(
      `Updating consumer with id: ${id} \n ${JSON.stringify(updateConsumerDto, null, 2)}`,
    );

    await this.checkConsumerFieldsExist(updateConsumerDto, id);
    await this.prisma.consumer.update({
      where: { id },
      data: updateConsumerDto,
    });

    this.logger.log(`Consumer ${id} updated successfully`);
    return null;
  }

  async delete(id: string) {
    this.logger.debug(`Deleting consumer with id: ${id}`);
    const findConsumer = await this.prisma.consumer.findUnique({
      where: { id },
    });
    if (!findConsumer) {
      throw new BusinessException(400, '用户不存在');
    }
    await this.prisma.consumer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(`Consumer ${id} deleted successfully`);
    return null;
  }
  private async checkConsumerFieldsExist(
    consumerDto: {
      username?: string;
      phone?: string;
    },
    id?: string,
  ) {
    const existingConsumer = await this.prisma.consumer.findFirst({
      where: {
        OR: [{ username: consumerDto.username }, { phone: consumerDto.phone }],
        id: {
          not: id,
        },
      },
    });

    if (existingConsumer) {
      if (existingConsumer.username === consumerDto.username) {
        throw new BusinessException(400, '用户名已存在，请重新输入.');
      }
      if (existingConsumer.phone === consumerDto.phone) {
        throw new BusinessException(400, '手机号已存在，请重新输入.');
      }
    }
    return true;
  }
}
