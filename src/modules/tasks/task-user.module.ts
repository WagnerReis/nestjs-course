import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { TaskUserController } from './task-user.controller';
import { CreateTaskUserUseCase } from './useCases/create-task-user.usecase';
import { ITaskUserRepository } from './repositories/task-user.repository';
import { TaskUserRepositoy } from './repositories/prisma/task-user.prisma.repository';

@Module({
  imports: [],
  controllers: [TaskUserController],
  providers: [
    PrismaService,
    CreateTaskUserUseCase,
    {
      provide: ITaskUserRepository,
      useClass: TaskUserRepositoy,
    },
  ],
  exports: [],
})
export class TaskUserModule {}
