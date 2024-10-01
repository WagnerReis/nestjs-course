import { Module } from '@nestjs/common';
import { NotificationTaskUserSchedule } from './notification-task-user.schedule';
import { ScheduleModule } from '@nestjs/schedule';
import { ITaskUserRepository } from 'src/modules/tasks/repositories/task-user.repository';
import { TaskUserPrismaRepositoy } from 'src/modules/tasks/repositories/prisma/task-user.prisma.repository';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    NotificationTaskUserSchedule,
    {
      provide: ITaskUserRepository,
      useClass: TaskUserPrismaRepositoy,
    },
  ],
})
export class ScheduleTaskModule {}
