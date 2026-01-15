import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import express from 'express';
import { User } from 'src/shared/decorators/user.decorator';
import * as client from '@prisma/client';
import { Roles } from 'src/shared/decorators/role.decorators';
import { RoleGuard } from 'src/shared/guards/role.guard';

// Inserido o interceptor aqui antes do controller, ele será aplicado para todas as rotas.
//@UseInterceptors(LoggingInterceptor)

//Usando o UseGuard aqui todos os guards declarados como parâmetro irão atuar em todas as rotas.
//Observar que a ordem da cada guard importa. Neste caso passar o AuthGuard e depois o RoleGuard.
@UseGuards(AuthGuard, RoleGuard)
// Aqui inserir o prefixo da rota.
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Posso alterar o status de retorno com o decorator @HttpCode(),
  // porém o código pode mudar o conteúdo da resposta.
  // Aqui usando o guard na rota list.
  //@UseGuards(AuthGuard)
  @Get()
  @HttpCode(200)

  // Usando o @Req para extrair o user que é injetado após a validação com Guard.
  // Aqui ficou um pouco diferente pois tive que usar module augmentation no Express
  // e adicionar o parâmetro user a request (isso já foi feito em outra matéria).
  //async list(@Req() { user }: express.Request) {

  // Agora usando o decorator @User. Neste caso o tipo vai ser User definido
  // no schema do prisma. Se eu definir um filtro, ele retorna apenas o campo
  // filtrado.
  async list(@User('email') user: client.User) {
    console.log(user);
    return await this.userService.list();
  }

  // Posso desestruturar params com o decorator (como está abaixo),
  // ou @Param() params: string[] e passar para o método params.id.
  // Neste caso estou aplicando um decorator personalizado.
  @Get(':id')
  async show(@ParamId() id: number) {
    return await this.userService.show(id);
  }

  // Usando o decorator @Roles() criado em aula para inserir no context qual tipo
  // de usuário pode acessar a rota. O bloqueio será feito por um Guard. Foi inserido
  // como metadata. Mesmo que o guard seja global para este controller, apenas as rotas
  // que tiverem os metadados inseridos terão o Role verificado.
  @Roles(client.Role.ADMIN)
  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  // Usando intercepatdor ParseIntPipe para já parsear a id.
  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return await this.userService.updateUser(id, body);
  }
  // Após implementar o interceptor, posso aplicá-lo a qualquer rota (que ele faça sentido).
  @UseInterceptors(LoggingInterceptor)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
