import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('/notification')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}
  @Get('/send-notification')
  testMsNotification() {
    this.notificationClient.emit('task_notification', 'Olá!');
  }
}
