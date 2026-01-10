import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Para interceptar os erros dos validadores.
  app.useGlobalPipes(new ValidationPipe());

  // Se precisar de um interceptor para todas as rotas da aplicação
  // então devo inserir o mesmo aqui no main:
  // app.useGlobalInterceptors(LoggingInteceptor) .

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
