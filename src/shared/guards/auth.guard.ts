import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import type { IUserRepository } from 'src/modules/users/domain/repositories/IuserRepository';
import { USER_REPOSITORY } from 'src/modules/users/utils/userRepository.token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext) {
    // Aqui, diferente da aula, foi tipado o getRequest() pois o retorno padrão é any,
    // causando alarmes do eslint e falha do InteliSense. Outras partes do código requerem
    // este cuidado.
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) return false;

    const token = authorization.split(' ')[1];
    const { valid, decoded } = await this.authService.validateToken(token);
    if (!valid) return false;

    // Usando o repository pois não quero o tratamento de service.
    const user = await this.userRepository.findById(Number(decoded?.sub));
    if (!user) return false;

    // Diferente da aula, tive que criar um tipo no Express com user dentro.
    request.user = user;

    return true;
  }
}
