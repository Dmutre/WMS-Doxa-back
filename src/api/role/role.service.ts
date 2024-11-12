import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateRoleData,
  FindRolesParams,
  UpdateRoleData,
} from 'src/lib/types/roles';

@Injectable()
export class RoleService {
  private readonly roleRepo: Prisma.RoleDelegate;
  private readonly permissionRepo: Prisma.PermissionDelegate;

  constructor(prisma: PrismaService) {
    this.roleRepo = prisma.role;
    this.permissionRepo = prisma.permission;
  }

  async findPerms(permissionIds?: string[]) {
    if (permissionIds) {
      if (!permissionIds.length) return { data: [] };
      const perms = await this.permissionRepo.findMany({
        where: { id: { in: permissionIds } },
      });
      if (permissionIds && perms.length !== permissionIds.length)
        throw new NotFoundException('Some permissions not found');
      return {
        data: perms,
      };
    }
    const perms = await this.permissionRepo.findMany();
    return {
      data: perms,
    };
  }

  async findRoles(params: FindRolesParams) {
    const { name, page, pageSize, orderBy, orderDirection } = params;
    const where = {
      name: { contains: name },
      isPreset: true,
    };
    const [roles, total] = await Promise.all([
      this.roleRepo.findMany({
        where,
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          permissions: {
            include: {
              permission: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              permission: {
                name: Prisma.SortOrder.asc,
              },
            },
          },
        },
      }),
      this.roleRepo.count({ where }),
    ]);
    return {
      data: roles,
      total,
    };
  }

  async findRole(id: string) {
    const role = await this.roleRepo.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            permission: {
              name: Prisma.SortOrder.asc,
            },
          },
        },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async existsRole(name: string) {
    const role = await this.roleRepo.findFirst({
      where: { name, isPreset: true },
    });
    if (role)
      throw new BadRequestException(`Role with name ${name} already exists`);
  }

  async createRole(data: CreateRoleData) {
    const { name, permissionIds } = data;
    await this.existsRole(name);
    const perms = await this.findPerms(permissionIds).then(({ data }) =>
      data.map((permission) => ({
        permissionId: permission.id,
      })),
    );
    const createdRole = await this.roleRepo.create({
      data: {
        name,
        isPreset: true,
        permissions: {
          createMany: {
            data: perms,
          },
        },
      },
      include: {
        permissions: {
          include: {
            permission: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            permission: {
              name: Prisma.SortOrder.asc,
            },
          },
        },
      },
    });
    return createdRole;
  }

  async updateRole(id: string, data: UpdateRoleData) {
    const role = await this.findRole(id);
    if (!data.name && !data.permissionIds) return role;
    const permIds = role.permissions.map((p) => p.permissionId);
    const { name = role.name, permissionIds = permIds } = data;
    if (name !== role.name) await this.existsRole(name);
    const perms = await this.findPerms(
      permissionIds.filter((id) => !permIds.includes(id)),
    ).then(({ data }) => data.map(({ id }) => ({ permissionId: id })));
    const updatedRole = await this.roleRepo.update({
      where: { id },
      data: {
        name: name ?? role.name,
        permissions: {
          createMany: {
            data: perms,
          },
          deleteMany: {
            roleId: id,
            permissionId: {
              notIn: permissionIds,
            },
          },
        },
      },
      include: {
        permissions: {
          include: {
            permission: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            permission: {
              name: Prisma.SortOrder.asc,
            },
          },
        },
      },
    });
    return updatedRole;
  }

  async forkRole(id: string, name?: string) {
    const role = await this.findRole(id);
    const connectPerms = role.permissions.map(({ permissionId }) => ({
      permissionId_roleId: {
        permissionId,
        roleId: id,
      },
    }));

    const forkedRole = await this.roleRepo.create({
      data: {
        name: name ?? role.name,
        isPreset: false,
        permissions: {
          connect: connectPerms,
        },
      },
      include: {
        permissions: true,
      },
    });
    return forkedRole;
  }

  async deleteRole(id: string, isPreset = true) {
    try {
      await this.roleRepo.delete({
        where: {
          id,
          isPreset,
        },
      });
    } catch {
      throw new NotFoundException('Role not found');
    }
  }
}
