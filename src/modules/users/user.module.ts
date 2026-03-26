import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './infra/user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ListUserService } from './services/listUser.service';
import { ShowUserService } from './services/showUser.service';
import { FindUserByEmailService } from './services/findUserByEmail.service ';
import { CreateUserService } from './services/createUser.service';
import { UpdateUserService } from './services/updateUser.service';
import { DeleteUserService } from './services/deleteUser.service';
import { UploadAvatarUserService } from './services/uploadAvatarUser.service';
import { InternalIdUserExistsService } from './services/internalIdUserExists.service';
import { UserRepository } from './infra/user.repository';
import { USER_REPOSITORY } from './utils/userRepository.token';
import { ReservationsModule } from '../reservations/reservations.module';
import { ShowUserWithLastReservationService } from './services/showUserWithLastReservation.service';

@Module({
  // forwardRef para resolver dependências circulares
  imports: [
    PrismaModule,
    forwardRef(() => SharedModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ReservationsModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}${file.originalname}`;
          return callback(null, filename);
        },
      }),
    }),
  ],
  providers: [
    ListUserService,
    ShowUserService,
    ShowUserWithLastReservationService,
    FindUserByEmailService,
    CreateUserService,
    UpdateUserService,
    DeleteUserService,
    UploadAvatarUserService,
    InternalIdUserExistsService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [
    FindUserByEmailService,
    CreateUserService,
    UpdateUserService,
    USER_REPOSITORY,
  ],
})
export class UserModule {}
