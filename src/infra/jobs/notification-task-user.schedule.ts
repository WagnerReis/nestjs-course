import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ITaskUserRepository } from 'src/modules/tasks/repositories/task-user.repository';

type MessageDTO = {
  email: string;
  startAt: Date;
  endAt: Date;
  name: string;
  title: string;
  description: string;
};

@Injectable()
export class NotificationTaskUserSchedule {
  constructor(
    private readonly taskUserRepository: ITaskUserRepository,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async getAllTaskDay() {
    const tasks = await this.taskUserRepository.findAllStartDay();
    console.log(' ======= Notificando ======= ');

    if (tasks) {
      tasks.forEach((task) => {
        const message: MessageDTO = {
          email: task.user.email,
          startAt: task.task.startAt,
          endAt: task.task.endAt,
          name: task.user.name,
          title: task.task.title,
          description: task.task.description,
        };
        this.notificationClient.emit('task_notification', message);
      });
    }
  }
}
