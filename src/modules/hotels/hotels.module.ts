import { Module } from '@nestjs/common';
import { HotelsController } from './infra/hotels.controller';
import { CreateHotelService } from './services/createHotel.service';
import { FindAllHotelService } from './services/findAllHotel.service';
import { FindHotelByIdService } from './services/findHotelById.service';
import { RemoveHotelService } from './services/removeHotel.service';
import { UpdateHotelService } from './services/updateHotel.service';
import { HOTEL_REPOSITORY } from './infra/hotelRepository.token';
import { HotelsRepository } from './infra/hotels.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FindHotelByNameService } from './services/findHotelByName.service';
import { FindHotelByOwnerService } from './services/findHotelByOwner.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [HotelsController],
  providers: [
    CreateHotelService,
    FindAllHotelService,
    FindHotelByIdService,
    FindHotelByNameService,
    FindHotelByOwnerService,
    RemoveHotelService,
    UpdateHotelService,
    {
      // Provendo o token para que se possa injetar o repositório seguindo a interface.
      provide: HOTEL_REPOSITORY,
      useClass: HotelsRepository,
    },
  ],
})
export class HotelsModule {}
