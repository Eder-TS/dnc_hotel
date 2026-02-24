import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from '../domain/dto/createUser.dto';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import * as client from '@prisma/client';
import { Roles } from 'src/shared/decorators/role.decorators';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { UserMatchGuard } from 'src/shared/guards/userMatch.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from 'src/shared/interceptors/fileValidation.interceptor';
import { ListUserService } from '../services/listUser.service';
import { ShowUserService } from '../services/showUser.service';
import { CreateUserService } from '../services/createUser.service';
import { UpdateUserService } from '../services/updateUser.service';
import { UpdateUserDTO } from '../domain/dto/updateUser.dto';
import { DeleteUserService } from '../services/deleteUser.service';
import { UploadAvatarUserService } from '../services/uploadAvatarUser.service';

// Inserido o interceptor aqui antes do controller, ele será aplicado para todas as rotas.
//@UseInterceptors(LoggingInterceptor)

//Usando o UseGuard aqui todos os guards declarados como parâmetro irão atuar em todas as rotas.
//Observar que a ordem da cada guard importa. Neste caso passar o AuthGuard e depois o RoleGuard.
//@UseGuards(AuthGuard, RoleGuard)
// Aqui inserir o prefixo da rota.
@Controller('users')
export class UserController {
  constructor(
    private readonly listUserService: ListUserService,
    private readonly showUserService: ShowUserService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly uploadAvatarUserService: UploadAvatarUserService,
  ) {}

  // Aplicando o limiter à esta rota.
  // Se usar o limiter globalmente no controller e quero deixar uma rota desprotegida
  // por qualquer motivo, então uso o @SkipThrottle().
  @UseGuards(AuthGuard, ThrottlerGuard)

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
    return await this.listUserService.execute();
  }

  // Aqui usando uma configuração específica do limiter para esta rota.
  @Throttle({ default: { limit: 3, ttl: 5000 } })

  // Posso desestruturar params com o decorator (como está abaixo),
  // ou @Param() params: string[] e passar para o método params.id.
  // Neste caso estou aplicando um decorator personalizado.
  @Get(':id')
  async show(@ParamId() id: number) {
    return await this.showUserService.execute(id);
  }

  // Usando o decorator @Roles() criado em aula para inserir no context qual tipo
  // de usuário pode acessar a rota. O bloqueio será feito por um Guard. Foi inserido
  // como metadata. Mesmo que o guard seja global para este controller, apenas as rotas
  // que tiverem os metadados inseridos terão o Role verificado.
  //@Roles(client.Role.ADMIN)
  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    console.log('fumo');
    return await this.createUserService.execute(body);
  }

  // Usado o Guard para validar a id se bate com userId.
  // User já foi lançado com AuthGuard para todo o controller.
  @UseGuards(UserMatchGuard)

  // Usando intercepatdor ParseIntPipe para já parsear a id.
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDTO,
  ) {
    return await this.updateUserService.execute(id, body);
  }

  // Usado o Guard para validar a id se bate com userId.
  // User já foi lançado com AuthGuard para todo o controller.
  @UseGuards(AuthGuard, UserMatchGuard)

  // Após implementar o interceptor, posso aplicá-lo a qualquer rota (que ele faça sentido).
  @UseInterceptors(LoggingInterceptor)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.deleteUserService.execute(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'), FileValidationInterceptor)
  @Post('avatar')
  async uploadAvatar(
    @User('id') id: number,
    @UploadedFile(
      // Pipe para validar arquivos
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            // Apenas arquivos de imagem serão aceitos.
            // Precisa especificar pra o NestJS para olhar o MIME type.
            // Pode precisar especificar skipMagicNumber.
            fileType: /^image\/(jpeg|png|webp)$/,
            fallbackToMimetype: true,
          }),
          new MaxFileSizeValidator({
            // Limitando o tamanho do arquivo.
            maxSize: 1024 * 1024,
          }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    return await this.uploadAvatarUserService.execute(id, avatar.filename);
  }
}
