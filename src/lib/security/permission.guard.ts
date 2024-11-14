import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { AuthService } from 'src/api/auth/auth.service';
import { Permissions } from 'src/lib/types/auth/permission';
import { AppContext } from '../types/common';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly cls: ClsService<AppContext>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<Permissions[]>(
      'permissions',
      context.getHandler(),
    );
    const userId = this.cls.get('user.id');
    const hasPermission = await this.authService.verifyPermissions(
      userId,
      permissions,
    );
    if (!hasPermission) throw new ForbiddenException();
    return true;
  }
}
