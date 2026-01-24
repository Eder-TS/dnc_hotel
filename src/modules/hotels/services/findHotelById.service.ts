import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY } from '../infra/hotelRepository.token';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';

@Injectable()
export class FindHotelByIdService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,
  ) {}

  async execute(id: number) {
    return this.hotelRepository.findHotelById(id);
  }
}
