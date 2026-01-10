import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();

    // Não é o mesmo next.function dos middlewares.
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();

        // Dentro de request há várias propriedades acessíveis.
        console.log(`URL: ${request.ip}`);
        console.log(`After... ${Date.now() - now}ms`);
      }),
    );
  }
}
