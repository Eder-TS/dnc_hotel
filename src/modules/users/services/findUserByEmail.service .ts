import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../utils/userRepository.token';
import type { IUserRepository } from '../domain/repositories/IuserRepository';

@Injectable()
export class FindUserByEmailService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);

    // Para o método de autenticação não deveria haver este retorno para evitar
    // que um invasor tente acertar o email. Lá no módulo de autenticação é utilizado
    // o repositório para ter o controle da exception.
    if (!user) throw new NotFoundException('Email not found.');
    return user;
  }
}
