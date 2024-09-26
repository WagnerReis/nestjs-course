import { PrismaService } from 'src/infra/database/prisma.service';
import {
  TaskUserRequestDTO,
  TaskUserResponseDTO,
} from '../../dto/task-user.dto';
import { ITaskUserRepository } from '../task-user.repository';

export class TaskUserRepositoy implements ITaskUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(data: TaskUserRequestDTO): Promise<TaskUserResponseDTO> {
    return this.prisma.taskUser.create({
      data: {
        task: {
          create: {
            description: data.description,
            title: data.title,
            endAt: data.endAt,
            startAt: data.startAt,
            priority: data.priority,
            status: data.status,
          },
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }
}
