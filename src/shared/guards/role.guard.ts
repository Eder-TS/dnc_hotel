import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/role.decorators';

// Um guard faz as verificações e retorna true ou false.
@Injectable()
export class RoleGuard implements CanActivate {
  // Reflector para "refletir" o controller
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    // Pegando os metadados. Aqui vai retornar um array de Role, pois pode ser
    // setada mais de uma role por rota.
    const requiredRules = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRules) return true;

    // Quando o usuário está autenticado, os dados de user são
    // inseridos na request.
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Veifica se no array de Role tem a role do usuário.
    return requiredRules.some((role) => user.role === role);
  }
}
