import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { CreateUserDTO } from './dto/user.dto';
import { CreateUserValidationPipe } from './pipe/create-user.validation.pipe';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('/')
  @UsePipes(new CreateUserValidationPipe())
  async create(@Body() data: CreateUserDTO) {
    return await this.createUserUseCase.execute(data);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile() {
    return { status: 'ok' };
  }
}
