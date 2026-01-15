import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Decorator que irá inserir no context a Role que for programada para alguma
// rota. Necessári um Guard para fazer a validação.
export const ROLES_KEY = 'roles';

// Inserindo informação como metadata.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
