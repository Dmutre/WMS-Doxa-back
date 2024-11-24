import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserAction } from 'src/lib/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/auth/permission';
import { Action } from 'src/lib/types/journal/user-action';
import { FindUserActionsParamsDto } from './dto/find-user-actions.dto';
import { UserActionListDto } from './dto/user-action.dto';
import { JournalService } from './journal.service';

@Controller('journal')
@ApiTags('Journal')
@ApiBearerAuth()
export class JournalConstroller {
  constructor(private readonly journalService: JournalService) {}

  @UserAction(Action.FIND_USER_ACTIONS)
  @AuthPermissions([Permissions.FIND_USER_ACTIONS])
  @Get('user-actions')
  @ApiOperation({ summary: 'Find list of user actions' })
  @ApiOkResponse({
    type: UserActionListDto,
  })
  async findUsers(@Query() params: FindUserActionsParamsDto) {
    return await this.journalService.findUserActions(params);
  }
}
