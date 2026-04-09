import { forwardRef, Module } from '@nestjs/common';
import { ReservationsController } from '../reservations/infra/reservations.controller';
import { CreateReservationsService } from './services/createReservations.service';
import { RESERVATIONS_REPOSITORY } from './utils/reservationsRepository.token';
import { ReservationsRepository } from './infra/reservations.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { HotelsModule } from '../hotels/hotels.module';
import { FindAllReservationsService } from './services/findAllReservations.service';
import { FindReservationsByIdService } from './services/findReservationsById.service';
import { FindReservationsByUserService } from './services/findReservationsByUser.service';
import { UpdateReservationsStatusService } from './services/updateReservationsStatus.service';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HotelsModule,
    forwardRef(() => UserModule),
  ],
  controllers: [ReservationsController],
  providers: [
    CreateReservationsService,
    FindAllReservationsService,
    FindReservationsByIdService,
    FindReservationsByUserService,
    UpdateReservationsStatusService,

    // Não é necessário declarar aqui o token de hotel ou qualquer outro
    // token de outros módulos. Eles devem ser exportados nos seus módulos
    // e o devido módulo deve ser importado aqui.
    { provide: RESERVATIONS_REPOSITORY, useClass: ReservationsRepository },
  ],
  exports: [RESERVATIONS_REPOSITORY],
})
export class ReservationsModule {}
