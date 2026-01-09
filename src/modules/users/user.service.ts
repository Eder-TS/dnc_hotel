import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDTO } from './domain/dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async show(id: string): Promise<User> {
    const user = await this.isIdExists(id);
    return user;
  }

  async createUser(body: CreateUserDTO): Promise<User> {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (emailExists)
      throw new HttpException(
        'This email already exists.',
        HttpStatus.CONFLICT,
      );

    return await this.prisma.user.create({ data: body });
  }

  async updateUser(id: any, body: any): Promise<User> {
    await this.isIdExists(id);
    return await this.prisma.user.update({
      where: { id: Number(id) },
      data: body,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.isIdExists(id);
    await this.prisma.user.delete({ where: { id: Number(id) } });
    return;
  }

  private async isIdExists(id: string) {
    const idToFind = Number(id);
    const userExists = await this.prisma.user.findUnique({
      where: { id: idToFind },
    });

    if (userExists === null)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    return userExists;
  }
}
