import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const id = context.switchToHttp().getRequest<Request>().params.id;

    // Como o user já foi adicionado ao context posso validar por ele.
    const user = context.switchToHttp().getRequest<Request>().user;

    if (user.id !== Number(id))
      throw new UnauthorizedException(
        'You are not allowed to perform this operation.',
      );

    return true;
  }
}
