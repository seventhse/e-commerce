import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BusinessException } from '~/common/exceptions/business.exception';
import { LoggerService } from '~/common/logger/logger.service';
import { CreateDistributionDto } from './dto/create-distribution.dto';
import { UpdateDistributionDto } from './dto/update-distribution.dto';
import { PageDistributionDto, SearchDistributionDto } from './dto/search-distribution.dto';

function buildDistributionWhere(searchDistributionDto: SearchDistributionDto): Prisma.DistributionWhereInput {
  const where: Prisma.DistributionWhereInput = {};

  if (searchDistributionDto.salesId) {
    where.salesId = searchDistributionDto.salesId;
  }
  if (searchDistributionDto.customerId) {
    where.customerId = searchDistributionDto.customerId;
  }

  return where;
}

const include = {
  sales: {
    select: {
      id: true,
      username: true,
      realName: true,
    },
  },
  customer: {
    select: {
      id: true,
      username: true,
      phone: true,
    },
  },
};

@Injectable()
export class DistributionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(DistributionService.name);
  }

  async list(searchDistributionDto: SearchDistributionDto) {
    this.logger.debug(
      `Finding distributions with filters \n ${JSON.stringify(searchDistributionDto, null, 2)}`,
    );
    const distributions = await this.prisma.distribution.findMany({
      where: buildDistributionWhere(searchDistributionDto),
      orderBy: { createdAt: 'desc' },
      include,
    });
    this.logger.debug(`Found ${distributions.length} distributions`);

    return distributions;
  }

  async page({ page, pageSize, ...search }: PageDistributionDto) {
    this.logger.debug(
      `Paginating distributions \n ${JSON.stringify({ page, pageSize, ...search }, null, 2)}`,
    );
    const where = buildDistributionWhere(search);
    const [distributions, total] = await Promise.all([
      this.prisma.distribution.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: { createdAt: 'desc' },
        include,
      }),
      this.prisma.distribution.count({ where }),
    ]);
    this.logger.debug(`Found ${distributions.length} distributions, total: ${total}`);

    return { records: distributions, total, page, pageSize };
  }

  async detail(id: string) {
    this.logger.debug(`Finding distribution details for id: ${id}`);
    const distribution = await this.prisma.distribution.findUnique({
      where: { id },
      include,
    });
    if (!distribution) {
      this.logger.warn(`Distribution not found with id ${id}`);
      throw new BusinessException(400, '分销关系不存在，请刷新查看最新数据.');
    }
    return distribution;
  }

  async create(createDistributionDto: CreateDistributionDto) {
    this.logger.debug(`Creating new distribution \n ${JSON.stringify(createDistributionDto, null, 2)}`);
    const distribution = await this.prisma.distribution.create({ data: createDistributionDto });
    this.logger.log(`Distribution created successfully: ${distribution.id}`);
    return distribution;
  }

  async update(id: string, updateDistributionDto: UpdateDistributionDto) {
    this.logger.debug(`Updating distribution with id: ${id} \n ${JSON.stringify(updateDistributionDto, null, 2)}`);
    await this.detail(id);
    const distribution = await this.prisma.distribution.update({ where: { id }, data: updateDistributionDto });
    this.logger.log(`Distribution ${id} updated successfully`);
    return distribution;
  }

  async delete(id: string) {
    this.logger.debug(`Deleting distribution with id: ${id}`);
    await this.detail(id);
    await this.prisma.distribution.delete({ where: { id } });
    this.logger.log(`Distribution ${id} deleted successfully`);
    return null;
  }
}
    });
  }

  remove(id: string) {
    return this.prisma.distribution.delete({ where: { id } });
  }
}