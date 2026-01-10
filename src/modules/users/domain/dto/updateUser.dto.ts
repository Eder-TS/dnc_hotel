import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './createUser.dto';

// Para usar as mesmas propriedades de CreateUserDTO mas de modo opcional.
export class UpdateUsrDTO extends PartialType(CreateUserDTO) {}
