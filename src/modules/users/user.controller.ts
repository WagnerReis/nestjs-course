import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { FileDTO, RequestWithUser, UserCreatedDTO } from './dto/user.dto';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { ProfileUserUseCase } from './usecases/profile-user.usecase';
import {
  CreateUserResponseSchemaDTO,
  CreateUserSchemaDTO,
} from './schemas/create-user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarUserUseCase } from './usecases/upload-avatar-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly profileUserUseCase: ProfileUserUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUserUseCase,
  ) {}

  @Post('/')
  async create(
    @Body() data: CreateUserSchemaDTO,
  ): Promise<CreateUserResponseSchemaDTO | null> {
    const user = await this.createUserUseCase.execute(data);
    if (!user) return null;
    return CreateUserResponseSchemaDTO.parse(user);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(
    @Request() req: RequestWithUser,
  ): Promise<Omit<UserCreatedDTO, 'password'> | null> {
    return await this.profileUserUseCase.execute(req.user.sub);
  }

  @Put('/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile() file: FileDTO,
  ) {
    const result = await this.uploadAvatarUseCase.execute({
      idUser: req.user.sub,
      file,
    });
    return result;
  }
}
