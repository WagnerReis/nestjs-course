import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../repository/user.repository';
import { UserCreatedDTO } from '../dto/user.dto';

@Injectable()
export class ProfileUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<Omit<UserCreatedDTO, 'password'>> {
    const user = await this.userRepository.findById(id);
    Reflect.deleteProperty(user, 'password');
    return user;
  }
}
