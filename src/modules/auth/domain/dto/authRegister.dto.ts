import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDTO } from 'src/modules/users/domain/dto/createUser.dto';

export class AuthRegisterDTO extends PartialType(CreateUserDTO) {
  // Este DTO está diferente da aula pois foi preciso declarar as propriedades
  // para que não fosem consideradas opcionais. Não sei por quê no código do
  // professor está funcionando!
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
