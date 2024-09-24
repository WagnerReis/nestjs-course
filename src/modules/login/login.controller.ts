import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { SignInUseCase } from './useCases/sign-in.usecase';
import { SignInDTO, SignInResponse } from './dto/sign-in.dto';

@Controller()
export class LoginController {
  constructor(private signInUseCase: SignInUseCase) {}

  @Post('/signIn')
  async singIn(
    @Body() signInDTO: SignInDTO,
  ): Promise<SignInResponse | UnauthorizedException> {
    const token = await this.signInUseCase.execute(signInDTO);
    return token;
  }
}
