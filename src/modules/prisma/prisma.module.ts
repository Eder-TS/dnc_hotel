import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// O decorator irá implementar a classe usando estes atributos.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
