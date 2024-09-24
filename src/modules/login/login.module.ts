import { Module } from '@nestjs/common';
import { SignInUseCase } from './useCases/sign-in.usecase';
import { IUserRepository } from '../users/repository/user.repository';
import { UserPrismaRepository } from '../users/repository/prisma/user.prisma.repository';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { LoginController } from './login.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'NESTJS_COURSE',
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  controllers: [LoginController],
  providers: [
    SignInUseCase,
    PrismaService,
    {
      provide: IUserRepository,
      useClass: UserPrismaRepository,
    },
  ],
})
export class LoginModule {}
