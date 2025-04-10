import { Injectable } from '@nestjs/common';
import { LoggerService } from '~/common/logger/logger.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import {
  PagePermissionDto,
  SearchPermissionDto,
} from './dto/search-permission.dto';
import { Prisma } from '@prisma/client';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto/edit-permission.dto';
import { BusinessException } from '~/common/exceptions/business.exception';

function buildWhere(searchDto: SearchPermissionDto) {
  const where: Prisma.PermissionWhereInput = {};

  if (searchDto.name) {
    where.name = {
      contains: searchDto.name,
      mode: 'insensitive',
    };
  }

  if (searchDto.code) {
    where.code = {
      contains: searchDto.code,
      mode: 'insensitive',
    };
  }

  if (searchDto.description) {
    where.description = {
      contains: searchDto.description,
      mode: 'insensitive',
    };
  }

  if (searchDto.isActive !== undefined) {
    where.isActive = searchDto.isActive;
  }

  return where;
}

@Injectable()
export class PermissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(PermissionService.name);
  }

  async findAll(searchDto: SearchPermissionDto) {
    this.logger.debug(
      `Finding all permissions with filters: ${JSON.stringify(searchDto)}`,
    );

    const result = await this.prisma.permission.findMany({
      where: buildWhere(searchDto),
      orderBy: {
        createdAt: 'desc',
      },
    });

    this.logger.debug(`Found ${result.length} permissions`);
    return result;
  }

  async findPage({ page, pageSize, ...searchDto }: PagePermissionDto) {
    this.logger.debug(`Finding permissions page ${page} with size ${pageSize}`);

    const where = buildWhere(searchDto);

    const [results, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.permission.count({ where }),
    ]);

    this.logger.debug(`Found ${results.length} permissions, total: ${total}`);

    return {
      records: results,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    this.logger.debug(`Finding permission with id: ${id}`);

    const result = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!result) {
      this.logger.error(`Permission with id ${id} not found`);
      throw new BusinessException(400, `权限不存在`);
    }

    return result;
  }

  async create(createDto: CreatePermissionDto) {
    this.logger.debug(`Creating new permission: ${createDto.name}`);

    // Check if permission with same code already exists
    const existingPermission = await this.prisma.permission.findFirst({
      where: { code: createDto.code },
    });

    if (existingPermission) {
      this.logger.error(
        `Permission with code ${createDto.code} already exists`,
      );
      throw new BusinessException(400, `权限代码 ${createDto.code} 已存在`);
    }

    const result = await this.prisma.permission.create({
      data: createDto,
    });

    this.logger.log(`Permission created successfully with id: ${result.id}`);
    return { id: result.id };
  }

  async update({ id, ...updateData }: UpdatePermissionDto) {
    this.logger.debug(`Updating permission with id: ${id}`);

    // Verify permission exists
    const existingPermission = await this.findOne(id);

    // If updating code, check it's not already used
    if (updateData.code && updateData.code !== existingPermission.code) {
      const codeExists = await this.prisma.permission.findFirst({
        where: {
          code: updateData.code,
          id: { not: id },
        },
      });

      if (codeExists) {
        throw new BusinessException(
          400,
          `权限代码 ${updateData.code} 已被其他权限使用`,
        );
      }
    }

    await this.prisma.permission.update({
      where: { id },
      data: {
        ...updateData,
        isActive: updateData.isActive ?? existingPermission.isActive,
      },
    });

    this.logger.log(`Permission ${id} updated successfully`);
    return null;
  }

  async delete(id: string) {
    this.logger.debug(`Deleting permission with id: ${id}`);

    // Verify permission exists
    await this.findOne(id);

    // Check if permission is in use by any roles
    const rolePermissionCount = await this.prisma.rolePermission.count({
      where: { permissionId: id },
    });

    if (rolePermissionCount > 0) {
      this.logger.error(
        `Permission ${id} is in use by ${rolePermissionCount} roles`,
      );
      throw new BusinessException(
        400,
        `该权限正在被${rolePermissionCount}个角色使用，无法删除`,
      );
    }

    await this.prisma.permission.delete({
      where: { id },
    });

    this.logger.log(`Permission ${id} deleted successfully`);
    return null;
  }

  async getRolePermissions(roleId: string) {
    this.logger.debug(`Getting permissions for role with id: ${roleId}`);

    // Verify role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new BusinessException(400, `角色不存在`);
    }

    // Get all permissions
    const allPermissions = await this.prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    // Get role's permissions
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });

    const rolePermissionIds = rolePermissions.map((rp) => rp.permissionId);

    // Mark which permissions are assigned to the role
    const result = allPermissions.map((permission) => ({
      ...permission,
      assigned: rolePermissionIds.includes(permission.id),
    }));

    this.logger.debug(
      `Found ${result.length} permissions for role ${roleId}, ${rolePermissionIds.length} assigned`,
    );

    return result;
  }
}
