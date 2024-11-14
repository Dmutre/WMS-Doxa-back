import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { Observable, tap } from 'rxjs';
import { JournalService } from 'src/api/journal/journal.service';
import { AppContext } from '../types/common';
import { UserActionContext } from '../types/journal/user-action';

@Injectable()
export class UserActionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserActionInterceptor.name);

  constructor(
    private readonly journalService: JournalService,
    private readonly reflector: Reflector,
    private readonly cls: ClsService<AppContext>,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = ctx.switchToHttp().getRequest();

    const userActionCtx = this.reflector.get<UserActionContext>(
      'userAction',
      ctx.getHandler(),
    );

    if (!userActionCtx) return next.handle();

    const { ip, body, params, query } = request;

    const payload = { ...body, ...params, ...query };

    const userId = this.cls.get('user.id');

    return next.handle().pipe(
      tap(() => {
        this.journalService
          .createUserAction({
            ip,
            userId,
            action: userActionCtx.action,
            payload,
          })
          .catch((error) => {
            this.logger.error({
              message: 'Failed to create user action',
              error,
            });
          });
      }),
    );
  }
}
