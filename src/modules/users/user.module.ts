import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  // forwardRef para resolver dependências circulares
  imports: [
    PrismaModule,
    forwardRef(() => SharedModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
