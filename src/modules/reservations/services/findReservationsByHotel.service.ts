import { Inject, Injectable } from '@nestjs/common';
import { RESERVATIONS_REPOSITORY } from '../utils/reservationsRepository.token';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { IReservationWithHotelData } from '../domain/repositories/Ireservation-with-hotel.data';

@Injectable()
export class FindReservationsByHotelService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}

  async execute(hotelId: number): Promise<IReservationWithHotelData[]> {
    return await this.reservationsRepository.findByHotel(hotelId);
  }
}
