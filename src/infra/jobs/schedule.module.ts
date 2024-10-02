import { Module } from '@nestjs/common';
import { NotificationTaskUserSchedule } from './notification-task-user.schedule';
import { ScheduleModule } from '@nestjs/schedule';
import { ITaskUserRepository } from 'src/modules/tasks/repositories/task-user.repository';
import { TaskUserPrismaRepositoy } from 'src/modules/tasks/repositories/prisma/task-user.prisma.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3002,
          host: '127.0.0.1',
        },
      },
    ]),
  ],
  providers: [
    NotificationTaskUserSchedule,
    {
      provide: ITaskUserRepository,
      useClass: TaskUserPrismaRepositoy,
    },
  ],
})
export class ScheduleTaskModule {}
