import { Injectable, Logger } from '@nestjs/common';
import { AvatarDTO } from '../dto/user.dto';
import { IUserRepository } from '../repository/user.repository';
import { extname } from 'path';
import { IStorage } from '../../../infra/providers/storage/storage';

@Injectable()
export class UploadAvatarUserUseCase {
  private readonly logger = new Logger(UploadAvatarUserUseCase.name);
  constructor(
    private readonly supabaseStorage: IStorage,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: AvatarDTO): Promise<any> {
    const extFile = extname(data.file.originalname);
    const transformname = `${data.idUser}${extFile}`;
    data.file.originalname = transformname;
    this.logger.log(`Uploading file ${data.file.originalname}`);
    const file = await this.supabaseStorage.upload(data.file, 'avatar');
    await this.userRepository.uploadAvatar(data.idUser, file.data.path);
    return file;
  }
}
