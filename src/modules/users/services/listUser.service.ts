import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../utils/userRepository.token';
import type { IUserRepository } from '../domain/repositories/IuserRepository';

@Injectable()
export class ListUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {
    return await this.userRepository.list();
  }
}
