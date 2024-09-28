import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserPrismaRepository } from './repository/prisma/user.prisma.repository';
import { IUserRepository } from './repository/user.repository';
import { ProfileUserUseCase } from './usecases/profile-user.usecase';
import { IStorage } from 'src/infra/providers/storage/storage';
import { SupabaseStorage } from 'src/infra/providers/storage/storage.supabase';
import { UploadAvatarUserUseCase } from './usecases/upload-avatar-user.usecase';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    PrismaService,
    UserPrismaRepository,
    ProfileUserUseCase,
    UploadAvatarUserUseCase,
    {
      provide: IUserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: IStorage,
      useClass: SupabaseStorage,
    },
  ],
})
export class UserModule {}
