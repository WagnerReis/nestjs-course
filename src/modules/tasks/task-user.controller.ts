import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateTaskUserUseCase } from './useCases/create-task-user.usecase';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { CreateTaskUserSchemaDTO } from './schema/task-user.schema';
import { RequestWithUser } from '../users/dto/user.dto';

@Controller('tasks')
export class TaskUserController {
  constructor(private taskUserUseCase: CreateTaskUserUseCase) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(
    @Body() data: CreateTaskUserSchemaDTO,
    @Request() req: RequestWithUser,
  ) {
    return this.taskUserUseCase.execute({
      ...data,
      userId: req.user.sub,
    });
  }
}
