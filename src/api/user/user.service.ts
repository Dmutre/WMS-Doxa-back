import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/repository/user.repository';
import { StatusEnum, User } from '@prisma/client';
import { PaginationOpts } from 'src/lib/types/common';

export interface ListUsersParams {
  email?: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async listUsers(
    params: ListUsersParams,
    opts: PaginationOpts,
  ): Promise<{ data: User[]; total: number }> {
    const { email, firstName, lastName } = params;

    return await this.userRepository.findMany(
      {
        email: { contains: email },
        firstName: { contains: firstName },
        lastName: { contains: lastName },
      },
      opts,
    );
  }

  async fireUser(id: string): Promise<User> {
    const user = await this.userRepository.findByOrThrow({ id });

    if (user.status === StatusEnum.FIRED) return user;

    const firedUser = await this.userRepository.updateUser(id, {
      status: StatusEnum.FIRED,
    });

    return firedUser;
  }
}
