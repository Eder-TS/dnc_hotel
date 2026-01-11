import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUsrDTO } from './domain/dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { userSelectFields } from '../prisma/utils/userSelectFields';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return await this.prisma.user.findMany({
      select: userSelectFields,
    });
  }

  async show(id: number) {
    const user = await this.isIdExists(id);
    return user;
  }

  async createUser(body: CreateUserDTO) {
    body.password = await this.hashPassword(body.password);
    const emailExists = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (emailExists)
      throw new HttpException(
        'This email already exists.',
        HttpStatus.CONFLICT,
      );

    return await this.prisma.user.create({
      data: body,
      select: userSelectFields,
    });
  }

  async updateUser(id: number, body: UpdateUsrDTO) {
    await this.isIdExists(id);

    if (body.password) {
      body.password = await this.hashPassword(body.password);
    }

    return await this.prisma.user.update({
      where: { id: Number(id) },
      data: body,
      select: userSelectFields,
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.isIdExists(id);
    await this.prisma.user.delete({ where: { id: Number(id) } });
    return;
  }

  private async isIdExists(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: id },
      select: userSelectFields,
    });

    if (userExists === null)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    return userExists;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
