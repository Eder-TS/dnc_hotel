import { Inject, Injectable } from '@nestjs/common';
import { InternalIdUserExistsService } from './internalIdUserExists.service';
import { IUserWithLastReservationData } from '../domain/repositories/IuserWithLastReservation.data';
import { RESERVATIONS_REPOSITORY } from 'src/modules/reservations/utils/hotelRepository.token';
import type { IReservationsRepository } from 'src/modules/reservations/domain/repositories/Ireservations.repository';

@Injectable()
export class ShowUserWithLastReservationService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,

    private readonly internalIdUserExistsService: InternalIdUserExistsService,
  ) {}

  async execute(id: number): Promise<IUserWithLastReservationData> {
    const user = await this.internalIdUserExistsService.execute(id);

    const [lastReservation] =
      await this.reservationsRepository.findLastReservation(id);

    const userWithLastReservation = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      lastReservation,
    };

    return userWithLastReservation;
  }
}
