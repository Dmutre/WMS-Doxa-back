import { PrismaClient } from '@prisma/client';
import { Permissions } from 'src/lib/presets/permission';
import { PresetRoles } from 'src/lib/presets/role';

const prisma = new PrismaClient();

async function seed() {
  const permissions = Object.values(Permissions);
  const createdPermissions = await Promise.all(
    permissions.map(async (permission) => {
      let existingPermission = await prisma.permission.findUnique({
        where: { name: permission },
      });

      if (!existingPermission) {
        existingPermission = await prisma.permission.create({
          data: { name: permission },
        });
      }

      return existingPermission;
    }),
  );

  for (const role of PresetRoles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name, isPreset: true },
    });

    if (existingRole) {
      await prisma.role.update({
        where: { id: existingRole.id },
        data: {
          permissions: {
            deleteMany: {},
            create: role.permissions.map((permissionName: string) => {
              const permission = createdPermissions.find(
                (p) => p.name === permissionName,
              );
              return {
                permissionId: permission?.id,
              };
            }),
          },
        },
      });
    } else {
      await prisma.role.create({
        data: {
          name: role.name,
          isPreset: true,
          permissions: {
            create: role.permissions.map((permissionName: string) => {
              const permission = createdPermissions.find(
                (p) => p.name === permissionName,
              );
              return {
                permissionId: permission?.id,
              };
            }),
          },
        },
      });
    }
  }

  console.log('Seeding completed');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
