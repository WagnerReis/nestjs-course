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
import { CreateUserDTO, RequestWithUser, UserCreatedDTO } from './dto/user.dto';
import { CreateUserValidationPipe } from './pipe/create-user.validation.pipe';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { ProfileUserUseCase } from './usecases/profile-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly profileUserUseCase: ProfileUserUseCase,
  ) {}

  @Post('/')
  @UsePipes(new CreateUserValidationPipe())
  async create(
    @Body() data: CreateUserDTO,
  ): Promise<Omit<CreateUserDTO, 'password'>> {
    return await this.createUserUseCase.execute(data);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(
    @Request() req: RequestWithUser,
  ): Promise<Omit<UserCreatedDTO, 'password'>> {
    return await this.profileUserUseCase.execute(req.user.sub);
  }
}
