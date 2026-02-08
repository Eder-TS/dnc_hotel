import { Injectable } from '@nestjs/common';
import { IUserSafeFieldsData } from '../domain/repositories/IuserSafeFields.data';
import { InternalIdUserExistsService } from './internalIdUserExists.service';

@Injectable()
export class ShowUserService {
  constructor(
    private readonly internalIdUserExistsService: InternalIdUserExistsService,
  ) {}

  async execute(id: number): Promise<IUserSafeFieldsData> {
    const user = await this.internalIdUserExistsService.execute(id);
    return user;
  }
}
