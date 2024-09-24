import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateUserDTO } from '../dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(data: CreateUserDTO): Promise<Omit<CreateUserDTO, 'password'>> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (user) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const passwordHashed = await hash(data.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: passwordHashed,
      },
    });

    Reflect.deleteProperty(newUser, 'password');

    return newUser;
  }
}
