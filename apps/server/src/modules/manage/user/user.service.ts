import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/common/prisma/prisma.service';
import { PageUserDto, SearchUserDto } from './dto/search-user.dto';
import { Prisma } from '@prisma/client';
import { argon2Hash } from '~/common/utils/argon2';
import { BusinessException } from '~/common/exceptions/business.exception';
import { LoggerService } from '~/common/logger/logger.service';
import { GrantUserDto, RevokeUserDto } from './dto/grant-user.dto';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/edit-user.dto';

function buildUserWhere(searchUserDto: SearchUserDto) {
  const where: Prisma.UserWhereInput = {
    deletedAt: null,
  };

  if (searchUserDto.username) {
    where.username = {
      contains: searchUserDto.username,
      mode: 'insensitive',
    };
  }
  if (searchUserDto.email) {
    where.email = { contains: searchUserDto.email, mode: 'insensitive' };
  }
  if (searchUserDto.phone) {
    where.phone = { contains: searchUserDto.phone };
  }
  if (searchUserDto.realName) {
    where.realName = {
      contains: searchUserDto.realName,
      mode: 'insensitive',
    };
  }
  if (searchUserDto.isActive !== undefined) {
    where.isActive = searchUserDto.isActive;
  }
  return where;
}

const include = {
  userRoles: {
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async list(searchUserDto: SearchUserDto) {
    this.logger.debug(
      `Finding users with filters \n ${JSON.stringify(searchUserDto, null, 2)}`,
    );
    const users = await this.prisma.user.findMany({
      where: buildUserWhere(searchUserDto),
      orderBy: {
        createdAt: 'desc',
      },
      omit: {
        password: true,
        deletedAt: true,
      },
      include,
    });
    this.logger.debug(JSON.stringify(users, null, 2));
    this.logger.debug(`Found ${users.length} users`);

    return users.map(({ userRoles, ...user }) => ({
      ...user,
      roles: userRoles.map((item) => item.role),
    }));
  }

  async page({ page, pageSize, ...search }: PageUserDto) {
    this.logger.debug(
      `Paginating users \n ${JSON.stringify({ page, pageSize, ...search }, null, 2)}`,
    );
    const where = buildUserWhere(search);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
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
        include,
      }),
      this.prisma.user.count({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    this.logger.debug(`Found ${users.length} users, total: ${total}`);
    return {
      records: users.map(({ userRoles, ...user }) => ({
        ...user,
        roles: userRoles.map((item) => item.role),
      })),
      total: total,
      page,
      pageSize,
    };
  }

  async detail(id: string) {
    this.logger.debug(`Finding user details for id: ${id}`);
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      omit: {
        password: true,
        deletedAt: true,
      },
      include,
    });
    if (user) {
      this.logger.debug(`Found user: ${user.username}`);
    } else {
      this.logger.debug(`User not found with id: ${id}`);
      return null;
    }

    const { userRoles, ...userInfo } = user;

    return {
      ...userInfo,
      roles: userRoles.map((item) => item.role),
    };
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      this.logger.warn(`User not found with id ${id}`);
      throw new BusinessException(400, '用户不存在，请刷新查看最新数据.');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.debug(
      `Creating new user \n ${JSON.stringify(createUserDto, null, 2)}`,
    );

    await this.checkUserFieldsExist(createUserDto);

    const hashedPassword = await argon2Hash(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    this.logger.log(`User created successfully: ${user.id}`);
    return null;
  }

  async update({ id, ...updateUserDto }: UpdateUserDto) {
    this.logger.debug(
      `Updating user with id: ${id} \n ${JSON.stringify(updateUserDto, null, 2)}`,
    );

    const res = await this.findUserById(id);

    await this.checkUserFieldsExist(updateUserDto, id);

    await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        isActive: updateUserDto.isActive ?? res.isActive,
      },
    });

    this.logger.log(`User ${id} updated successfully`);
    return null;
  }

  async delete(id: string) {
    this.logger.debug(`Deleting user with id: ${id}`);
    await this.findUserById(id);

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`User ${id} deleted successfully`);
    return null;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { id, password } = updatePasswordDto;
    this.logger.debug(
      `Updating user password with id: ${id} \n ${JSON.stringify(updatePasswordDto, null, 2)}`,
    );
    await this.findUserById(id);

    const hashedPassword = await argon2Hash(password);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    this.logger.log(`User ${id} password updated successfully`);
    return null;
  }

  async grant(grantUserDto: GrantUserDto) {
    const { userId, roleIds } = grantUserDto;
    this.logger.debug(
      `Granting user role with id: ${userId} \n ${JSON.stringify(grantUserDto, null, 2)}`,
    );
    await this.findUserById(userId);

    await this.prisma.userRole.deleteMany({
      where: {
        userId: userId,
      },
    });

    if (roleIds && roleIds.length > 0) {
      await this.prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId: userId,
          roleId: roleId,
        })),
      });
    }

    this.logger.log(`User ${userId} role granted successfully`);
    return null;
  }

  async revoke(revokeUserDto: RevokeUserDto) {
    const { userId, roleIds } = revokeUserDto;
    this.logger.debug(
      `Revoking user role with userId: ${userId} and roleId: ${roleIds.join(',')} \n ${JSON.stringify(revokeUserDto, null, 2)}`,
    );
    await this.findUserById(userId);

    if (roleIds && roleIds.length > 0) {
      await this.prisma.userRole.deleteMany({
        where: {
          userId: userId,
          roleId: {
            in: roleIds,
          },
        },
      });
    } else {
      this.logger.warn(
        `No role IDs provided for revocation for user ${userId}`,
      );
      throw new BusinessException(400, '请提供要撤销的角色ID');
    }

    this.logger.log(
      `User ${userId} role ${roleIds.join(',')} revoked successfully`,
    );
  }

  private async checkUserFieldsExist(
    userDto: {
      username?: string;
      email?: string;
      phone?: string;
    },
    id?: string,
  ) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: userDto.username },
          { email: userDto.email },
          { phone: userDto.phone },
        ],
        id: {
          not: id,
        },
      },
    });

    if (existingUser) {
      if (existingUser.username === userDto.username) {
        throw new BusinessException(400, '用户名已存在，请重新输入.');
      }
      if (existingUser.email === userDto.email) {
        throw new BusinessException(400, '邮箱已存在，请重新输入.');
      }
      if (existingUser.phone === userDto.phone) {
        throw new BusinessException(400, '手机号已存在，请重新输入.');
      }
    }
    return true;
  }
}
