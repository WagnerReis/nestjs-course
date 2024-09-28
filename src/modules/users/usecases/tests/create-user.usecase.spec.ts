import { Test } from '@nestjs/testing';
import { CreateUserUseCase } from '../create-user.usecase';
import { CreateUserDTO, UserCreatedDTO } from '../../dto/user.dto';
import { IUserRepository } from '../../repository/user.repository';
import { UserInMemoryRepository } from '../../repository/in-memory/user-in-memory.repository';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepository,
          useClass: UserInMemoryRepository,
        },
      ],
    }).compile();

    createUserUseCase = moduleRef.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be able to create a new user', async () => {
    const data: CreateUserDTO = {
      name: 'John Doe',
      username: 'John Doe',
      email: 'john@example.com',
      password: 'XXXXXXXX',
    };

    const result: Omit<UserCreatedDTO, 'password'> =
      await createUserUseCase.execute(data);
    expect(result.email).toBe('john@example.com');
    expect(result.name).toBe('John Doe');
    expect(result.username).toBe('John Doe');
    expect(result).toHaveProperty('id');
  });

  it('should not be able to create a new user if username already exists', async () => {
    const data: CreateUserDTO = {
      name: 'John Doe',
      username: 'user_name_already_exists',
      email: 'user_name_already_exists@example.com',
      password: 'XXXXXXXX',
    };

    await createUserUseCase.execute(data);
    expect(async () => await createUserUseCase.execute(data)).rejects.toThrow();
  });
});
