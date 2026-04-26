import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Para interceptar os erros dos validadores.
  app.useGlobalPipes(new ValidationPipe());

  // O CORS é configurado aqui no main.
  // Posso apenas usar enableCors sem parâmetros para qualquer cliente acessar ou
  // posso especificar alguns parâmetros para limitar os endereços e métodos de acesso.
  app.enableCors({
    origin: 'http://dnc-hotel-ui-ke76.vercel.app',
    methods: 'GET, PATCH, POST, DELETE',
    //allowedHeaders: 'Content-type, Accept',
    //credentials: true,
  });

  // Se precisar de um interceptor para todas as rotas da aplicação
  // então devo inserir o mesmo aqui no main:
  // app.useGlobalInterceptors(LoggingInteceptor) .

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
