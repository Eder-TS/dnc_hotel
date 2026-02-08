import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../domain/dto/createUser.dto';
import { hashUserPassword } from '../helpers/hashUserPassword';
import { USER_REPOSITORY } from '../utils/userRepository.token';
import type { IUserRepository } from '../domain/repositories/IuserRepository';
import { UserSafeFieldsDTO } from '../domain/dto/userSafeFields.dto';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(body: CreateUserDTO): Promise<UserSafeFieldsDTO> {
    const emailExists = await this.userRepository.findByEmail(body.email);
    if (emailExists)
      throw new HttpException(
        'This email already exists.',
        HttpStatus.CONFLICT,
      );

    body.password = await hashUserPassword(body.password);

    return await this.userRepository.create(body);
  }
}
