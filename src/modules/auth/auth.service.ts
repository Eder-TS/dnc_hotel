import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { CreateUserDTO } from '../users/domain/dto/createUser.dto';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';

// Foi importado o módulo de User para que o acesso aos recursos de
// User sejam feitos através dele, mantendo a coerência do código.
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  private async generateJwtToken(user: User) {
    const payload = { sub: user.id, name: user.name };
    const options = {
      // TS estava acusando erro em signAsync por nenhuma sobrescrição bater com a chamada
      // pois o professor passou expiresIn: '1d'.
      // Solução do chatGPT foi tipar expiresIn para Number com 60 * 60 * 20.
      // Olhando as definições do método foi observado que o quê estava errado era a sintaxe:
      // em runtime '1d' funciona em JS mas o TS não aceita pois as unidades possíveis de
      // expiresIn são number, StringValue (tipo próprio) e undefined.
      // StringValue é template literal: `${number}D`, sendo D's possíveis: D, Day, Days, Y, Year...
      expiresIn: 60 * 60 * 20,
      issuer: 'dnc_hotel',
      audience: 'users',
    };
    return { access_token: await this.jwtService.signAsync(payload, options) };
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid credentials.');
    return await this.generateJwtToken(user);
  }

  async register(body: AuthRegisterDTO) {
    const newUser: CreateUserDTO = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role ?? Role.USER,
    };
    const user = await this.userService.createUser(newUser);

    return await this.generateJwtToken(user);
  }
}
