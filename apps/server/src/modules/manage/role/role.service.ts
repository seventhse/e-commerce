import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/common/prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { BusinessException } from '~/common/exceptions/business.exception';
import { PageRoleDto, SearchRoleDto } from './dto/search-role.dto';
import { Prisma } from '@prisma/client';
import { RolePermissionDto } from './dto/grant-role.dto';

function buildRoleWhere(searchRoleDto: SearchRoleDto) {
  const where: Prisma.RoleWhereInput = {};

  if (searchRoleDto.name) {
    where.name = {
      contains: searchRoleDto.name,
      mode: 'insensitive',
    };
  }

  if (searchRoleDto.description) {
    where.description = {
      contains: searchRoleDto.description,
      mode: 'insensitive',
    };
  }

  if (searchRoleDto.isActive !== undefined) {
    where.isActive = searchRoleDto.isActive;
  }

  return where;
}

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(searchRoleDto: SearchRoleDto) {
    return this.prisma.role.findMany({
      where: buildRoleWhere(searchRoleDto),
    });
  }

  async findAllByPage({ page, pageSize, ...searchRoleDto }: PageRoleDto) {
    const where = buildRoleWhere(searchRoleDto);
    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      records: roles,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) {
      throw new BusinessException(400, '角色不存在.');
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto) {
    await this.checkRoleName(createRoleDto.name);

    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async update({ id, ...updateRoleDto }: UpdateRoleDto) {
    const res = await this.findOne(id); // Ensure the role exists

    if (updateRoleDto.name) {
      await this.checkRoleName(updateRoleDto.name, id);
    }

    await this.prisma.role.update({
      where: { id },
      data: {
        ...updateRoleDto,
        isActive: updateRoleDto.isActive ?? res.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.checkRoleRelation(id);
    return this.prisma.role.delete({ where: { id } });
  }

  async batchRemove(ids: string[]) {
    await this.checkRoleRelation(ids);
    await this.prisma.role.deleteMany({ where: { id: { in: ids } } });
  }

  async grant(rolePermissionDto: RolePermissionDto) {
    const { roleId, permissionIds } = rolePermissionDto;

    // Check if the role exists
    await this.findOne(roleId);

    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    await this.prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
    });
  }

  async revoke(rolePermissionDto: RolePermissionDto) {
    const { roleId, permissionIds } = rolePermissionDto;

    await this.findOne(roleId);

    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: {
          in: permissionIds,
        },
      },
    });
  }

  private async checkRoleRelation(id: string | string[]) {
    const exists = await this.prisma.userRole.count({
      where: {
        roleId: {
          in: Array.isArray(id) ? id : [id],
        },
      },
    });

    if (exists > 0) {
      throw new BusinessException(400, '角色关联用户，无法删除.');
    }
  }

  private async checkRoleName(name: string, id?: string) {
    const where: Prisma.RoleWhereInput = {
      name,
    };

    if (id) {
      where.id = {
        not: id,
      };
    }

    const existsRole = await this.prisma.role.count({ where });
    if (existsRole > 0) {
      throw new BusinessException(400, '角色名称已存在.');
    }
  }
}
