import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './infra/user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Module({
  // forwardRef para resolver dependências circulares
  imports: [
    PrismaModule,
    forwardRef(() => SharedModule),
    forwardRef(() => AuthModule),
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
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
