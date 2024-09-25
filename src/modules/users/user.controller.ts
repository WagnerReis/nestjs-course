import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { RequestWithUser, UserCreatedDTO } from './dto/user.dto';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { ProfileUserUseCase } from './usecases/profile-user.usecase';
import {
  CreateUserResponseSchemaDTO,
  CreateUserSchemaDTO,
} from './schemas/create-user.schema';
import { CreateUserValidationPipe } from './pipe/create-user.validation.pipe';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly profileUserUseCase: ProfileUserUseCase,
  ) {}

  @Post('/')
  @UsePipes(new CreateUserValidationPipe())
  async create(
    @Body() data: CreateUserSchemaDTO,
  ): Promise<CreateUserResponseSchemaDTO | null> {
    const user = await this.createUserUseCase.execute(data);
    if (!user) return null;
    const parsedUser = CreateUserResponseSchemaDTO.safeParse(user);

    if (parsedUser.success) {
      return parsedUser.data;
    } else {
      console.error('Error parsing user:', parsedUser.error);
      return null;
    }
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(
    @Request() req: RequestWithUser,
  ): Promise<Omit<UserCreatedDTO, 'password'> | null> {
    return await this.profileUserUseCase.execute(req.user.sub);
  }
}
