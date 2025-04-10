import { Injectable } from '@nestjs/common';
import { LoggerService } from '~/common/logger/logger.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import {
  PageCommodityDto,
  SearchCommodityDto,
} from './dto/search-commodity.dto';
import { Prisma } from '@prisma/client';
import {
  CreateCommodityDto,
  UpdateCommodityDto,
} from './dto/edit-commodity.dto';
import { BusinessException } from '~/common/exceptions/business.exception';

function buildWhere(searchDto: SearchCommodityDto) {
  const where: Prisma.CommodityWhereInput = {};

  if (searchDto.name) {
    where.name = {
      contains: searchDto.name,
      mode: 'insensitive',
    };
  }

  if (searchDto.description) {
    where.description = {
      contains: searchDto.description,
      mode: 'insensitive',
    };
  }

  if (searchDto.minPrice !== undefined && searchDto.maxPrice === undefined) {
    where.price = {
      gte: searchDto.minPrice,
    };
  } else if (
    searchDto.minPrice === undefined &&
    searchDto.maxPrice !== undefined
  ) {
    where.price = {
      lte: searchDto.maxPrice,
    };
  } else {
    where.AND = [
      {
        price: { gte: searchDto.minPrice },
      },
      {
        price: { lte: searchDto.maxPrice },
      },
    ];
  }

  if (searchDto.categoryId) {
    where.categoryId = searchDto.categoryId;
  }

  if (searchDto.isActive !== undefined) {
    where.isActive = searchDto.isActive;
  }

  return where;
}

const include: Prisma.CommodityInclude = {
  category: true,
  images: {
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

@Injectable()
export class CommodityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CommodityService.name);
  }

  async findAll(searchDto: SearchCommodityDto) {
    this.logger.debug(
      `Finding all commodities with filters: ${JSON.stringify(searchDto)}`,
    );

    const result = await this.prisma.commodity.findMany({
      where: buildWhere(searchDto),
      include,
    });

    this.logger.debug(`Found ${result.length} commodities`);
    return result;
  }

  async findPage({ page, pageSize, ...searchDto }: PageCommodityDto) {
    this.logger.debug(`Finding commodities page ${page} with size ${pageSize}`);

    const where = buildWhere(searchDto);

    const [results, total] = await Promise.all([
      this.prisma.commodity.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.commodity.count({ where }),
    ]);

    this.logger.debug(`Found ${results.length} commodities, total: ${total}`);

    return {
      records: results,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    this.logger.debug(`Finding commodity with id: ${id}`);

    const result = await this.prisma.commodity.findUnique({
      where: { id },
      include: {},
    });

    if (!result) {
      this.logger.error(`Commodity with id ${id} not found`);
      throw new BusinessException(404, `商品不存在`);
    }

    return result;
  }

  async create(createDto: CreateCommodityDto) {
    this.logger.debug(`Creating new commodity: ${createDto.name}`);

    // Validate category exists
    await this.validateCategory(createDto.categoryId);

    const { images, ...commodityData } = createDto;

    // Create commodity with transaction to handle images
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the commodity
      const commodity = await tx.commodity.create({
        data: commodityData,
      });

      // If images are provided, create them
      if (images && images.length > 0) {
        await tx.commodityImage.createMany({
          data: images.map((image, index) => ({
            ...image,
            sortOrder: image.sortOrder || index + 1,
            commodityId: commodity.id,
          })),
        });
      }

      return commodity;
    });

    this.logger.log(`Commodity created successfully with id: ${result.id}`);
    return { id: result.id };
  }

  async update({ id, images, ...updateData }: UpdateCommodityDto) {
    this.logger.debug(`Updating commodity with id: ${id}`);

    try {
      // Verify commodity exists
      await this.findOne(id);

      // Validate category if provided
      if (updateData.categoryId) {
        await this.validateCategory(updateData.categoryId);
      }

      // Update with transaction to handle images
      await this.prisma.$transaction(async (tx) => {
        // Update the commodity data
        await tx.commodity.update({
          where: { id },
          data: updateData,
        });

        // Handle images if provided
        if (images) {
          // Delete existing images
          await tx.commodityImage.deleteMany({
            where: { commodityId: id },
          });

          // Create new images
          if (images.length > 0) {
            await tx.commodityImage.createMany({
              data: images.map((image, index) => ({
                ...image,
                sortOrder: image.sortOrder || index + 1,
                commodityId: id,
              })),
            });
          }
        }
      });

      this.logger.log(`Commodity ${id} updated successfully`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to update commodity ${id}: ${error}`);
      throw error instanceof BusinessException
        ? error
        : new BusinessException(400, '更新商品失败，请稍后重试');
    }
  }

  async delete(id: string) {
    this.logger.debug(`Deleting commodity with id: ${id}`);

    try {
      // Verify commodity exists
      await this.findOne(id);

      // Delete with transaction to properly handle relations
      await this.prisma.$transaction(async (tx) => {
        // Delete related images first
        await tx.commodityImage.deleteMany({
          where: { commodityId: id },
        });

        // Delete the commodity
        await tx.commodity.delete({
          where: { id },
        });
      });

      this.logger.log(`Commodity ${id} deleted successfully`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to delete commodity ${id}: ${error}`);
      throw error instanceof BusinessException
        ? error
        : new BusinessException(500, '删除商品失败，请稍后重试');
    }
  }

  private async validateCategory(categoryId: string) {
    const category = await this.prisma.commodityCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      this.logger.error(`Category with id ${categoryId} not found`);
      throw new BusinessException(400, '所选商品分类不存在');
    }

    if (category.isActive === false) {
      this.logger.error(`Category with id ${categoryId} is inactive`);
      throw new BusinessException(400, '所选商品分类已被禁用');
    }

    return category;
  }
}
