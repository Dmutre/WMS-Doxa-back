import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';

@Injectable()
export class UserMapper {
  map(user: User & { role: Role }) {
    const { password, shiftSchedule, ...userData } = user;
    return userData;
  }
}
