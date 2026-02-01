import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { RESERVATIONS_REPOSITORY } from '../utils/hotelRepository.token';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';

@Injectable()
export class UpdateReservationsStatusService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}

  async execute(updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationsRepository.findById(
      updateReservationDto.id,
    );
    if (!reservation) throw new NotFoundException('Reservation not found.');

    return await this.reservationsRepository.updateStatus(updateReservationDto);
  }
}
