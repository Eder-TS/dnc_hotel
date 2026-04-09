import { Inject, Injectable } from '@nestjs/common';
import { RESERVATIONS_REPOSITORY } from '../utils/reservationsRepository.token';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';

@Injectable()
export class FindReservationsByIdService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}

  async execute(id: number) {
    return await this.reservationsRepository.findById(id);
  }
}
