import { SetMetadata } from '@nestjs/common';
import { Action } from '../types/journal/user-action';

export const UserAction = (action: Action) =>
  SetMetadata('userAction', { action });
