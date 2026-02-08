import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../utils/userRepository.token';
import type { IUserRepository } from '../domain/repositories/IuserRepository';
import { IUserSafeFieldsData } from '../domain/repositories/IuserSafeFields.data';

@Injectable()
export class InternalIdUserExistsService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<IUserSafeFieldsData> {
    const userExists = await this.userRepository.findById(id);

    if (userExists === null)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    return userExists;
  }
}
