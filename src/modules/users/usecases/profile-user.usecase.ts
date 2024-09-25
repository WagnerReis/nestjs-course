import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../repository/user.repository';
import { UserCreatedDTO } from '../dto/user.dto';

@Injectable()
export class ProfileUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<Omit<UserCreatedDTO, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    Reflect.deleteProperty(user, 'password');
    return user;
  }
}
