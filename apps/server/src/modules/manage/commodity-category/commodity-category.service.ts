import { Injectable } from '@nestjs/common';
import { LoggerService } from '~/common/logger/logger.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import {
  PageCommodityCategoryDto,
  SearchCommodityCategoryDto,
} from './dto/search-commodity-category.dto';
import { Prisma } from '@prisma/client';
import {
  CreateCommodityCategoryDto,
  UpdateCommodityCategoryDto,
} from './dto/edit-commodity-category.dto';

function buildWhere(searchDto: SearchCommodityCategoryDto) {
  const where: Prisma.CommodityCategoryWhereInput = {};

  if (searchDto.name) {
    where.name = {
      contains: searchDto.name,
      mode: 'insensitive',
    };
  }

  if (searchDto.description) {
    where.description = {
      equals: searchDto.description,
      mode: 'insensitive',
    };
  }

  if (searchDto.isActive) {
    where.isActive = searchDto.isActive;
  }

  if (searchDto.isDisplayed) {
    where.isDisplayed = searchDto.isDisplayed;
  }

  return where;
}

// TODO: User data primission
@Injectable()
export class CommodityCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CommodityCategoryService.name);
  }

  async findAll(searchDto: SearchCommodityCategoryDto) {
    this.logger.debug(
      `Finding all commodity categories with filters: ${JSON.stringify(searchDto, null, 2)}`,
    );

    const result = await this.prisma.commodityCategory.findMany({
      where: {
        ...buildWhere(searchDto),
      },
    });

    this.logger.debug(`Found ${result.length} commodity categories`);
    return result;
  }

  async findPage({ page, pageSize, ...searchDto }: PageCommodityCategoryDto) {
    this.logger.debug(
      `Finding commodity categories page ${page} with size ${pageSize}`,
    );

    const where = buildWhere(searchDto);

    const [records, total] = await Promise.all([
      this.prisma.commodityCategory.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.commodityCategory.count({ where }),
    ]);

    this.logger.debug(
      `Found ${records.length} commodity categories for page ${page}, total: ${total}`,
    );

    return {
      records,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    this.logger.debug(`Finding commodity category with id: ${id}`);

    const result = await this.prisma.commodityCategory.findUnique({
      where: { id },
    });
    if (!result) {
      this.logger.error(`Commodity category with id ${id} not found`);
      throw new Error(`Commodity category with id ${id} not found`);
    }

    this.logger.debug(`Found commodity category: ${result.name}`);
    return result;
  }

  async create(createDto: CreateCommodityCategoryDto) {
    this.logger.debug(
      `Creating new commodity category: ${JSON.stringify(createDto, null, 2)}`,
    );

    const category = await this.prisma.commodityCategory.create({
      data: createDto,
    });

    this.logger.log(
      `Commodity category created successfully with id: ${category.id}`,
    );
  }

  async update({ id, ...data }: UpdateCommodityCategoryDto) {
    this.logger.debug(
      `Updating commodity category with id ${id}: ${JSON.stringify(data, null, 2)}`,
    );

    const res = await this.findOne(id);

    await this.prisma.commodityCategory.update({
      where: { id: id },
      data: {
        ...data,
        isActive: data.isActive ?? res.isActive,
        isDisplayed: data.isDisplayed ?? res.isDisplayed,
      },
    });

    this.logger.log(`Commodity category ${id} updated successfully`);
  }

  async delete(id: string) {
    this.logger.debug(`Deleting commodity category with id: ${id}`);

    await this.findOne(id);

    await this.prisma.commodityCategory.delete({
      where: { id },
    });

    this.logger.log(`Commodity category ${id} deleted successfully`);
  }
}
