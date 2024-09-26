import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { RequestWithUser, UserCreatedDTO } from './dto/user.dto';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { ProfileUserUseCase } from './usecases/profile-user.usecase';
import {
  CreateUserResponseSchemaDTO,
  CreateUserSchemaDTO,
} from './schemas/create-user.schema';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly profileUserUseCase: ProfileUserUseCase,
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
}
