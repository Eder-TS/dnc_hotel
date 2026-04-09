import { forwardRef, Module } from '@nestjs/common';
import { HotelsController } from './infra/hotels.controller';
import { CreateHotelService } from './services/createHotel.service';
import { FindAllHotelService } from './services/findAllHotel.service';
import { FindHotelByIdService } from './services/findHotelById.service';
import { RemoveHotelService } from './services/removeHotel.service';
import { UpdateHotelService } from './services/updateHotel.service';
import { HOTEL_REPOSITORY } from './utils/hotelRepository.token';
import { HotelsRepository } from './infra/hotels.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FindHotelByNameService } from './services/findHotelByName.service';
import { FindHotelsByOwnerService } from './services/findHotelsByOwner.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UploadImageHotelService } from './services/uploadImageHotel.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,

    // Não há HotelModule em UserModule, mas há HotelModule em ReservationsModule
    // que tem referência circular com UserModule.
    // A frase acima era verdade até ser refatorada a função FindHotelsByOwnerService e utilizada em
    // UserModule, mas o aviso ainda é válido para a situação anterior.
    forwardRef(() => UserModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads-hotel',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}${file.originalname}`;
          return callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [HotelsController],
  providers: [
    CreateHotelService,
    FindAllHotelService,
    FindHotelByIdService,
    FindHotelByNameService,
    FindHotelsByOwnerService,
    RemoveHotelService,
    UpdateHotelService,
    UploadImageHotelService,
    {
      // Provendo o token para que se possa injetar o repositório seguindo a interface.
      provide: HOTEL_REPOSITORY,
      useClass: HotelsRepository,
    },
  ],

  exports: [
    FindHotelsByOwnerService,

    // Exportando o token para poder ser usado fora do módulo.
    HOTEL_REPOSITORY,
  ],
})
export class HotelsModule {}
