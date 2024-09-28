import { Injectable, Logger } from '@nestjs/common';
import { AvatarDTO } from '../dto/user.dto';
import { IStorage } from 'src/infra/providers/storage/storage';
import { IUserRepository } from '../repository/user.repository';

@Injectable()
export class UploadAvatarUserUseCase {
  private readonly logger = new Logger(UploadAvatarUserUseCase.name);
  constructor(
    private readonly supabaseStorage: IStorage,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: AvatarDTO): Promise<any> {
    this.logger.log(`Uploading file ${data.file.originalname}`);
    const file = await this.supabaseStorage.upload(data.file, 'avatar');
    this.logger.log(file);
    return file;
  }
}
