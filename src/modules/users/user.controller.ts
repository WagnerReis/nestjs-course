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
import { ProfileUserUseCase } from './usecases/profile-user.usecase';
import {
  CreateUserResponseSchemaDTO,
  CreateUserSchema,
  CreateUserSchemaDTO,
} from './schemas/create-user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarUserUseCase } from './usecases/upload-avatar-user.usecase';
import { AuthGuard } from '../../infra/providers/auth-guard.provider';
import { zodToOpenAPI } from 'nestjs-zod';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const schemaUserSwagger = zodToOpenAPI(CreateUserSchema);

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly profileUserUseCase: ProfileUserUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUserUseCase,
  ) {}

  @Post('/')
  @ApiBody({
    schema: schemaUserSwagger,
    description: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created!',
  })
  @ApiResponse({ status: 400, description: 'User already exists!' })
  async create(
    @Body() data: CreateUserSchemaDTO,
  ): Promise<CreateUserResponseSchemaDTO | null> {
    const user = await this.createUserUseCase.execute(data);
    if (!user) return null;
    return CreateUserResponseSchemaDTO.parse(user);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile',
  })
  async profile(
    @Request() req: RequestWithUser,
  ): Promise<Omit<UserCreatedDTO, 'password'> | null> {
    return await this.profileUserUseCase.execute(req.user.sub);
  }

  @Put('/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
