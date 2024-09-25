import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserPrismaRepository } from './repository/prisma/user.prisma.repository';
import { IUserRepository } from './repository/user.repository';
import { ProfileUserUseCase } from './usecases/profile-user.usecase';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    PrismaService,
    UserPrismaRepository,
    ProfileUserUseCase,
    {
      provide: IUserRepository,
      useClass: UserPrismaRepository,
    },
  ],
})
export class UserModule {}
