import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { userSelectFields } from '../prisma/utils/userSelectFields';
import { join, resolve } from 'path';
import { existsSync, statSync, unlinkSync } from 'fs';

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

  async findByEmail(email: string) {
    // Professor passou "select: userSelectFields" para o método porém,
    // no método de autenticação é preciso comparar a senha, então não estou usando
    // este select.
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Para o método de autenticação não deveria haver este retorno para evitar
    // que um invasor tente acertar o email.
    if (!user) throw new NotFoundException('Email not found.');
    return user;
  }

  async createUser(body: CreateUserDTO) {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (emailExists)
      throw new HttpException(
        'This email already exists.',
        HttpStatus.CONFLICT,
      );

    body.password = await this.hashPassword(body.password);
    return await this.prisma.user.create({
      data: body,
      select: userSelectFields,
    });
  }

  async updateUser(id: number, body: UpdateUserDTO) {
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

  // Melhorar DTO
  async uploadAvatar(id: number, avatarFilename: string) {
    const user = await this.isIdExists(id);

    // Cria o caminho até onde as imagens são guardadas.
    // Na aula o professor passou __dirname e o caminho relativo, porém quebrou pois
    // o TS compilou para dist/. process.cwd() funciona em várias situações (compilação em dist, docker, ...)
    const directory = resolve(process.cwd(), 'uploads');
    if (user.avatar) {
      // Junta o diretório com o nome do arquivo para formar o caminho completo.
      const userAvatarFilePath = join(directory, user.avatar);

      // Verifica a existência do arquivo. Num projeto passado ocorriam erros durante
      // alguns testes pois o arquivo havia sido apagado manualmente.
      // Na aula o professor usou o método statSync, existsSync funciona melhor.
      if (existsSync(userAvatarFilePath)) {
        // From node.js: unlink() deletes a name from the filesystem.  If that name was the
        // last link to a file and no processes have the file open, the file
        // is deleted and the space it was using is made available for reuse.
        unlinkSync(userAvatarFilePath);
      }
    }

    return await this.updateUser(id, { avatar: avatarFilename });
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
