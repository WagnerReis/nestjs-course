import { Module } from '@nestjs/common';
import { SignInUseCase } from './useCases/sign-in.usecase';
import { IUserRepository } from '../users/repository/user.repository';
import { UserPrismaRepository } from '../users/repository/prisma/user.prisma.repository';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from './login.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  controllers: [LoginController],
  providers: [
    SignInUseCase,
    {
      provide: IUserRepository,
      useClass: UserPrismaRepository,
    },
  ],
})
export class LoginModule {}
