import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/users/user.module';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

/**
 * SharedModule
 *
 * Centraliza providers reutilizáveis entre múltiplos módulos.
 * Introduzido antecipadamente para manter guards e interceptors
 * explícitos no container de DI.
 *
 * Baseado em boas práticas de NestJS.
 */
@Module({
  imports: [AuthModule, forwardRef(() => UserModule)],
  providers: [AuthGuard, LoggingInterceptor],
  exports: [AuthGuard, LoggingInterceptor],
})
export class SharedModule {}
