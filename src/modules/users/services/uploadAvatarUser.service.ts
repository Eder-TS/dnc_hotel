import { Inject, Injectable } from '@nestjs/common';
import { join, resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { InternalIdUserExistsService } from './internalIdUserExists.service';
import { IUpdateUserData } from '../domain/repositories/IupdateUser.data';
import { USER_REPOSITORY } from '../utils/userRepository.token';
import type { IUserRepository } from '../domain/repositories/IuserRepository';

@Injectable()
export class UploadAvatarUserService {
  constructor(
    private readonly internalIdUserExistsService: InternalIdUserExistsService,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  // Melhorar DTO
  async execute(id: number, avatarFilename: string) {
    const user = await this.internalIdUserExistsService.execute(id);

    // Cria o caminho até onde as imagens são guardadas.
    // Na aula o professor passou __dirname e o caminho relativo, porém quebrou pois
    // o TS compilou para dist/. process.cwd() funciona em várias situações (compilação em dist, docker, ...)
    const directory = resolve(process.cwd(), 'uploads');
    if (user.avatar) {
      // Junta o diretório com o nome do arquivo para formar o caminho completo.
      const userAvatarFilePath = join(directory, user.avatar);

      // Verifica a existência do arquivo. Num projeto passado ocorriam erros durante
      // alguns testes pois o arquivo havia sido apagado manualmente.
      // Na aula o professor usou o método statSync, existsSync funciona melhor.
      if (existsSync(userAvatarFilePath)) {
        // From node.js: unlink() deletes a name from the filesystem.  If that name was the
        // last link to a file and no processes have the file open, the file
        // is deleted and the space it was using is made available for reuse.
        unlinkSync(userAvatarFilePath);
      }
    }

    const data: IUpdateUserData = {
      id: id,
      avatar: avatarFilename,
    };

    return await this.userRepository.update(data);
  }
}
