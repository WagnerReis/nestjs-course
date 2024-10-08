import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
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
  private readonly logger = new Logger(NotificationTaskUserSchedule.name);
  constructor(
    private readonly taskUserRepository: ITaskUserRepository,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientKafka,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async getAllTaskDay() {
    const tasks = await this.taskUserRepository.findAllStartDay();
    this.logger.log('Sending notification...', JSON.stringify(tasks));
    console.log('tasks', tasks);

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
        this.notificationClient.emit('tp_task_notification', message);
      });
    }
  }
}
