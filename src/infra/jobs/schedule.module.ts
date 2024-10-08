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
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['127.0.0.1:9092'],
          },
          consumer: {
            groupId: 'gp_app_task_manager',
          },
          producer: {
            allowAutoTopicCreation: false,
          },
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
