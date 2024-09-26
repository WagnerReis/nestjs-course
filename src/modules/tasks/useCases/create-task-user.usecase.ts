import { Injectable } from '@nestjs/common';
import { ITaskUserRepository } from '../repositories/task-user.repository';
import { TaskUserRequestDTO } from '../dto/task-user.dto';

@Injectable()
export class CreateTaskUserUseCase {
  constructor(private taskUserRepository: ITaskUserRepository) {}

  async execute(data: TaskUserRequestDTO) {
    return this.taskUserRepository.save(data);
  }
}
