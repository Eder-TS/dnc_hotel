import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import bcrypt from 'bcrypt';
import { CreateUserDTO } from '../users/domain/dto/createUser.dto';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';
import { AuthValidTokenDTO } from './domain/dto/authValidToken.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { templateHTMLSendToken } from './utils/templateHTMLSendToken';
import { IUserSafeFieldsData } from '../users/domain/repositories/IuserSafeFields.data';
import { FindUserByEmailService } from '../users/services/findUserByEmail.service ';
import { CreateUserService } from '../users/services/createUser.service';
import { UpdateUserService } from '../users/services/updateUser.service';
import { USER_REPOSITORY } from '../users/utils/userRepository.token';
import type { IUserRepository } from '../users/domain/repositories/IuserRepository';

// Foi importado o módulo de User para que o acesso aos recursos de
// User sejam feitos através dele, mantendo a coerência do código.
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    private readonly jwtService: JwtService,
    private readonly findUserByEmailService: FindUserByEmailService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly mailerService: MailerService,
  ) {}

  async login({ email, password }: AuthLoginDTO) {
    // Usando o repositório de user em vez do service para ter o controle da exception.
    const user = await this.userRepository.findByEmail(email);
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
    const user = await this.createUserService.execute(newUser);

    return await this.generateJwtToken(user);
  }

  async resetPassword({ token, newPassword }: AuthResetPasswordDTO) {
    const { valid, decoded } = await this.validateToken(token);
    if (!valid) throw new UnauthorizedException('Invalid token.');
    const user = await this.updateUserService.execute(Number(decoded?.sub), {
      password: newPassword,
    });

    return await this.generateJwtToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.findUserByEmailService.execute(email);
    const expiresIn = 1800;
    const token = await this.generateJwtToken(user, expiresIn);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password - DNC Hotel',
      html: templateHTMLSendToken(user.name, token.access_token),
    });

    return `A verification code has been sent to ${email}`;
  }

  private async generateJwtToken(
    user: IUserSafeFieldsData,
    expiresIn: number = 86400,
  ) {
    const payload = { sub: user.id, name: user.name };
    const options = {
      // TS estava acusando erro em signAsync por nenhuma sobrescrição bater com a chamada
      // pois o professor passou expiresIn: '1d'.
      // Solução do chatGPT foi tipar expiresIn para Number com 60 * 60 * 20.
      // Olhando as definições do método foi observado que o quê estava errado era a sintaxe:
      // em runtime '1d' funciona em JS mas o TS não aceita pois as unidades possíveis de
      // expiresIn são number, StringValue (tipo próprio) e undefined.
      // StringValue é template literal: `${number}D`, sendo D's possíveis: D, Day, Days, Y, Year...
      expiresIn: expiresIn,
      issuer: 'dnc_hotel',
      audience: 'users',
    };
    return { access_token: await this.jwtService.signAsync(payload, options) };
  }

  async validateToken(token: string): Promise<AuthValidTokenDTO> {
    try {
      // No exemplo da aula não foi usado try/catch e o retorno do método
      // era desconstruído podendo ser validado com if.
      // Aqui será tratada a falha de verifyAsync com catch. O retorno possível vem com
      // o payload do token, então posso usá-lo.
      const decoded = await this.jwtService.verifyAsync(token);

      return { valid: true, decoded };
    } catch (error) {
      return { valid: false };
    }
  }
}
