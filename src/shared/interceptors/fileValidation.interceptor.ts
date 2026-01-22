import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import fs from 'fs';

// Validator para excluir arquivo que está sendo salvo quando o mesmo não passa
// no validator de tipo e tamanho.
@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Importante notar que este validator pega o erro que vem no pipe de retorno
    // para o client.
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof BadRequestException) {
          const request = context.switchToHttp().getRequest();
          const file = request.file;

          if (file) {
            fs.unlink(file.path, (unlinkErr) => {
              if (unlinkErr) console.error('Error removing file.', unlinkErr);
            });
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
