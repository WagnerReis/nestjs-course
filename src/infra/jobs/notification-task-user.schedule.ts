import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ITaskUserRepository } from 'src/modules/tasks/repositories/task-user.repository';

@Injectable()
export class NotificationTaskUserSchedule {
  constructor(private readonly taskUserRepository: ITaskUserRepository) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async getAllTaskDay() {
    const tasks = await this.taskUserRepository.findAllStartDay();
    console.log(tasks);
  }
}
