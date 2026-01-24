import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HotelsModule } from './modules/hotels/hotels.module';

// Todos os módulos devem ser importados aqui para que sejam carregados pela aplicação.
// Diferente da aula, tive de seguir a documentação do NestJS e trabalhar com
// ConfigModule para ter as variáveis de ambiente disponíveis no momento da avaliação
// de alguns módulos pelo NestJS na inicialização. No momento o módulo "problemático" é
// o JWT que pede a secret na inicialização. A importação de dotenv no main não funciona
// pois o main é carregado depois das avaliações dos módulos pelo NestJS.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    SharedModule,

    // Módulo nativo
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // tempo em milissegundos
        limit: 10, // requisições
      },
    ]),

    // Módulo nativo
    MailerModule.forRoot({
      transport: process.env.SMTP,
      defaults: {
        from: `"dnc-hotel"<${process.env.EMAIL_USER}>`,
      },
    }),

    HotelsModule,
  ],
  // Declarando um provider para que o throttler seja aplicado a toda a aplicação.
  providers: [{ provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class AppModule {}
