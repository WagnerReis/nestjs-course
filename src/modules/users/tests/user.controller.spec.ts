import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { CreateUserSchemaDTO } from '../schemas/create-user.schema';
import { IUserRepository } from '../repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ProfileUserUseCase } from '../usecases/profile-user.usecase';
import { UploadAvatarUserUseCase } from '../usecases/upload-avatar-user.usecase';
import { IStorage } from '../../../infra/providers/storage/storage';
import { randomUUID } from 'crypto';

describe('User Controller', () => {
  let userController: UserController;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [UserController],
      providers: [
        CreateUserUseCase,
        ProfileUserUseCase,
        UploadAvatarUserUseCase,
        {
          provide: IUserRepository,
          useValue: {
            create: jest.fn(),
            findByUsernameOrEmail: jest.fn(),
            findByUsername: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: IStorage,
          useValue: {
            upload: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userRepository = moduleRef.get<IUserRepository>(IUserRepository);
  });

  it('should be able to create a new user', async () => {
    const body: CreateUserSchemaDTO = {
      name: 'John Doe',
      username: 'John Doe',
      email: 'john@example.com',
      password: 'XXXXXXXXXXX',
    };

    jest.spyOn(userRepository, 'save').mockResolvedValue({
      ...body,
      id: randomUUID(),
      createdAt: new Date(),
    });

    const result = await userController.create(body);
    expect(result).toHaveProperty('username');
  });
});
