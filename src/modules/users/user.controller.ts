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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './domain/dto/createUser.dto';

// Aqui inserir o prefixo da rota.
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Posso alterar o status de retorno com o decorator @HttpCode(),
  // porém o código pode mudar o conteúdo da resposta.
  @Get()
  @HttpCode(200)
  async list() {
    return await this.userService.list();
  }

  // Posso desestruturar params com o decorator (como está abaixo),
  // ou @Param() params: string[] e passar para o método params.id.
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.show(id);
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  // Usando intercepatdor ParseIntPipe para já parsear a id.
  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
