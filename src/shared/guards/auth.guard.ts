import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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

    const user = await this.userService.show(Number(decoded?.sub));
    if (!user) return false;

    // Diferente da aula, tive que criar um tipo no Express com user dentro.
    request.user = user;

    return true;
  }
}
