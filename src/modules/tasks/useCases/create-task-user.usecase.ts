import { Injectable, Logger } from '@nestjs/common';
import { ITaskUserRepository } from '../repositories/task-user.repository';
import { TaskUserRequestDTO } from '../dto/task-user.dto';

@Injectable()
export class CreateTaskUserUseCase {
  private readonly logger = new Logger(CreateTaskUserUseCase.name);
  constructor(private taskUserRepository: ITaskUserRepository) {}

  async execute(data: TaskUserRequestDTO) {
    this.logger.log(`... Criando task ...`, { ...data });
    return this.taskUserRepository.save(data);
  }
}
