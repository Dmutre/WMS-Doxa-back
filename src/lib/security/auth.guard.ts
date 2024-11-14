import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AuthService } from '../../api/auth/auth.service';
import { AppContext } from '../types/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly cls: ClsService<AppContext>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No token provided');
    const payload = await this.authService.verifyToken(token);
    this.cls.set('user', {
      id: payload.sub,
      email: payload.email,
    });
    return true;
  }
}
