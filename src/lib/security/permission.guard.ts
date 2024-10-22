import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../../api/auth/auth.service';
import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { Permissions } from '../types/presets/permission';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user /* : User */ = request.user; // User from prisma does not include user role entity. It is bug that should be fixed
    const permissions = this.reflector.get<Permissions[]>(
      'permissions',
      context.getHandler(),
    );
    if (permissions.length === 0) return true;

    const hasPermission = permissions.every((permission) =>
      user.role.permissions.find(({ name }) => name === permission),
    );

    if (!hasPermission)
      throw new ForbiddenException({
        message: 'User doesn`t has permission',
      });

    return true;
  }
}
