import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';

@Injectable()
export class FindHotelsByOwnerService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,
  ) {}

  async execute(ownerId: number) {
    return this.hotelRepository.findHotelsByOwner(ownerId);
  }
}
