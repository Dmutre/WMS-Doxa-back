import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserConstroller {
  constructor(private readonly userService: UserService) {}
}
