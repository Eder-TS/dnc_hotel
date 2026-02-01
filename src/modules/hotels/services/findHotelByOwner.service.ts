import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';

@Injectable()
export class FindHotelByOwnerService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,
  ) {}

  async execute(ownerId: number) {
    return this.hotelRepository.findHotelByOwner(ownerId);
  }
}
