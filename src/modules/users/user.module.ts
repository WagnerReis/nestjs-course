import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserPrismaRepository } from './repository/prisma/user.prisma.repository';
import { IUserRepository } from './repository/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    PrismaService,
    UserPrismaRepository,
    {
      provide: IUserRepository,
      useClass: UserPrismaRepository,
    },
  ],
})
export class UserModule {}
