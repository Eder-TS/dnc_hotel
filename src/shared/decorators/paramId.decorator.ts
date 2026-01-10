import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Posso criar decorators personalizados para minha aplicação.
// Neste caso estou parseando o id para number.
export const ParamId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    return Number(id);
  },
);
