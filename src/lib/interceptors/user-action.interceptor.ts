import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { JournalService } from 'src/api/journal/journal.service';
import { UserActionContext } from '../types/journal/user-action';

@Injectable()
export class UserActionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserActionInterceptor.name);

  constructor(
    private readonly journalService: JournalService,
    private readonly reflector: Reflector,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = ctx.switchToHttp().getRequest();

    const userActionCtx = this.reflector.get<UserActionContext>(
      'userAction',
      ctx.getHandler(),
    );

    if (!userActionCtx) return next.handle();

    const { user, ip, body, params, query } = request;

    const payload = { ...body, ...params, ...query };

    return next.handle().pipe(
      tap(() => {
        this.journalService
          .createUserAction({
            ip,
            userId: user?.id ?? null,
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
