import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../database/repository/user.repository';
import { RegistrationDTO } from './dto/registration.dto';
import * as crypto from 'crypto';
import { hashPassword } from 'src/utils/crypto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUserProfile(data: RegistrationDTO) {
    await this.throwIfUserExists(data.email);
    data.password = await hashPassword(data.password);
  }

  private async throwIfUserExists(email: string) {
    const user = await this.userRepo.findBy({ email });
    if (user)
      throw new BadRequestException({
        message: 'User with such email already exists',
      });
  }
}
