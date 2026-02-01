import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';

@Injectable()
export class RemoveHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,
  ) {}

  async execute(id: number) {
    return await this.hotelRepository.deleteHotel(id);
  }
}
