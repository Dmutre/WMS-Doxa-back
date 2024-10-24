import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from 'src/lib/types/auth/permission';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
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
