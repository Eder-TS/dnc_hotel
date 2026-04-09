import { Inject, Injectable } from '@nestjs/common';
import { InternalIdUserExistsService } from './internalIdUserExists.service';
import { IUserWithData } from '../domain/repositories/IuserWith.data';
import { RESERVATIONS_REPOSITORY } from 'src/modules/reservations/utils/reservationsRepository.token';
import type { IReservationsRepository } from 'src/modules/reservations/domain/repositories/Ireservations.repository';
import { IReservationWithHotelData } from 'src/modules/reservations/domain/repositories/Ireservation-with-hotel.data';
import { HOTEL_REPOSITORY } from 'src/modules/hotels/utils/hotelRepository.token';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/Ihotel.repository';
import { IHotelData } from 'src/modules/hotels/domain/repositories/Ihotel.data';

@Injectable()
export class ShowUserWithDataService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelsRepository: IHotelRepository,

    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,

    private readonly internalIdUserExistsService: InternalIdUserExistsService,
  ) {}

  async execute(id: number): Promise<IUserWithData> {
    const user = await this.internalIdUserExistsService.execute(id);

    let lastReservation: IReservationWithHotelData;
    let myHotels: IHotelData[];

    let userWithData: IUserWithData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    };

    if (user.role === 'USER') {
      const [reservation] =
        await this.reservationsRepository.findLastReservation(id);
      lastReservation = reservation;

      userWithData = { ...userWithData, lastReservation };
    } else {
      myHotels = await this.hotelsRepository.findHotelsByOwner(id);

      userWithData = { ...userWithData, myHotels };
    }

    return userWithData;
  }
}
