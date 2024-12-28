import { Command, CommandRunner } from 'nest-commander';
import { UserService } from 'src/api/user/user.service';

@Command({
  name: 'sudo',
  arguments: '<firstName> <lastName> <email>, <password>',
  options: { isDefault: true },
  description: 'Create a super user',
})
export class SudoCommand extends CommandRunner {
  constructor(private readonly userService: UserService) {
    super();
  }

  async run([firstName, lastName, email, password]: string[]): Promise<void> {
    await this.userService.createSuperUser({
      firstName,
      lastName,
      email,
      password,
    });
  }
}
