import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '../domain/dto/updateUser.dto';
import { hashUserPassword } from '../helpers/hashUserPassword';
import { UserSafeFieldsDTO } from '../domain/dto/userSafeFields.dto';
import { USER_REPOSITORY } from '../utils/userRepository.token';
import type { IUserRepository } from '../domain/repositories/IuserRepository';
import { InternalIdUserExistsService } from './internalIdUserExists.service';
import { IUpdateUserData } from '../domain/repositories/IupdateUser.data';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly internalIdUserExistsService: InternalIdUserExistsService,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, body: UpdateUserDTO): Promise<UserSafeFieldsDTO> {
    await this.internalIdUserExistsService.execute(id);

    if (body.password) {
      body.password = await hashUserPassword(body.password);
    }
    const data: IUpdateUserData = {
      id: id,
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      avatar: body.avatar,
    };

    return await this.userRepository.update(data);
  }
}
