import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { IUserRepository } from '../domain/repositories/IuserRepository';
import { User } from '@prisma/client';
import { ICreateUserData } from '../domain/repositories/IcreateUser.data';
import { IUpdateUserData } from '../domain/repositories/IupdateUser.data';
import { IUserSafeFieldsData } from '../domain/repositories/IuserSafeFields.data';
import { userSelectFields } from './prisma/userSelectFields';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: ICreateUserData): Promise<IUserSafeFieldsData> {
    return this.prisma.user.create({
      data,
      select: userSelectFields,
    });
  }

  list(): Promise<IUserSafeFieldsData[]> {
    return this.prisma.user.findMany({
      select: userSelectFields,
    });
  }

  findById(id: number): Promise<IUserSafeFieldsData | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    // Professor passou "select: userSelectFields" para o método porém,
    // no método de autenticação é preciso comparar a senha, então não estou usando
    // este select.
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(data: IUpdateUserData): Promise<IUserSafeFieldsData> {
    return this.prisma.user.update({
      where: { id: data.id },
      data,
      select: userSelectFields,
    });
  }

  delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
