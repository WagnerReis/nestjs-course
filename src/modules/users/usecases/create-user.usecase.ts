import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDTO } from '../dto/user.dto';
import { hash } from 'bcrypt';
import { IUserRepository } from '../repository/user.repository';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<Omit<CreateUserDTO, 'password'>> {
    const user = await this.userRepository.findByUsernameOrEmail({
      username: data.username,
      email: data.email,
    });

    if (user) {
      this.logger.error(`User ${data.username} already exists...`, {
        ...data,
        password: null,
      });
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const password = await hash(data.password, 10);

    return await this.userRepository.save({
      ...data,
      password,
    });
  }
}
