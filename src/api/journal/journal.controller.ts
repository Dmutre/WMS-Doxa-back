import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FindUserActionsParamsDto } from './dto/find-user-actions.dto';
import { JournalService } from './journal.service';

// TODO: Add authorization and permission guards
//       Describe response interfaces
@Controller('journal')
@ApiTags('Journal')
@ApiBearerAuth()
export class JournalConstroller {
  constructor(private readonly journalService: JournalService) {}

  @Get('user-actions')
  @ApiOperation({ summary: 'Find list of user actions' })
  async findUsers(@Query() params: FindUserActionsParamsDto) {
    return await this.journalService.findUserActions(params);
  }
}
