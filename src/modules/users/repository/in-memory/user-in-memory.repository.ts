import { randomUUID } from 'crypto';
import {
  UsernameAndEmail,
  UserCreatedDTO,
  CreateUserDTO,
} from '../../dto/user.dto';
import { IUserRepository } from '../user.repository';

export class UserInMemoryRepository implements IUserRepository {
  private users: UserCreatedDTO[] = [];

  async findByUsernameOrEmail(
    data: UsernameAndEmail,
  ): Promise<UserCreatedDTO | null> {
    const user = this.users.find(
      (user) => user.username === data.username || user.email === data.email,
    );
    return user ?? null;
  }

  async findByUsername(username: string): Promise<UserCreatedDTO | null> {
    const user = this.users.find((user) => user.username === username);
    return user ?? null;
  }

  async save(data: CreateUserDTO): Promise<UserCreatedDTO> {
    const user = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<UserCreatedDTO | null> {
    const user = this.users.find((user) => user.id === id);
    return user ?? null;
  }

  async uploadAvatar(id: string, path: string): Promise<void> {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      user['avatarUrl'] = path;
    }
  }
}
