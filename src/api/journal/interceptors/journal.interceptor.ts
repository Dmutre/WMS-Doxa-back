import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { UserActionInterceptor } from 'src/lib/core/interceptors/user-action.interceptor';
import { UserAction } from 'src/lib/core/types/user-action';
import { AppContext } from 'src/lib/types/common';
import { JournalService } from '../journal.service';

@Injectable()
export class JournalInterceptor extends UserActionInterceptor {
  constructor(
    private readonly journalService: JournalService,
    private readonly cls: ClsService<AppContext>,
  ) {
    super({
      capture: {
        response: false,
      },
    });
  }

  protected override async afterAction(userAction: UserAction): Promise<void> {
    const { action, ip, body, params, query } = userAction;
    const userId = this.cls.get('user.id');
    this.journalService
      .createUserAction({
        ip,
        userId,
        action,
        payload: { body, params, query },
      })
      .catch((error) => {
        this.logger.error({
          message: 'Failed to create user action',
          error,
        });
      });
  }
}
