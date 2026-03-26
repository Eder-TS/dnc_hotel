import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
        limit: 20, // requisições
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
    ReservationsModule,
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),

    // Módulo para expor de forma estática a pasta uploads-hotel.
    // Nativo do NestJS para servir uma URl direta para este tipo de recurso.
    // No frontend apenas declaro em src http//:localhost:3333/uploads-hotel/nome-da-imagem.
    // Atenção com o path: dist, docker, etc.
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', '..', 'uploads-hotel'),
        serveRoot: '/uploads-hotel',
      },
      {
        rootPath: join(__dirname, '..', '..', 'uploads'),
        serveRoot: '/uploads',
      },
    ),
  ],
  // Declarando um provider para que o throttler seja aplicado a toda a aplicação.
  providers: [{ provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class AppModule {}
