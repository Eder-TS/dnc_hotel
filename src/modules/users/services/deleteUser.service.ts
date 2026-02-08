import { Inject, Injectable } from '@nestjs/common';
import { InternalIdUserExistsService } from './internalIdUserExists.service';
import { USER_REPOSITORY } from '../utils/userRepository.token';
import type { IUserRepository } from '../domain/repositories/IuserRepository';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    private readonly internalIdUserExistsService: InternalIdUserExistsService,
  ) {}

  async execute(id: number): Promise<void> {
    await this.internalIdUserExistsService.execute(id);
    await this.userRepository.delete(id);
    return;
  }
}
