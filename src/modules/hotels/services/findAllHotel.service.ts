import { Inject, Injectable } from '@nestjs/common';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { HOTEL_REPOSITORY } from '../infra/hotelRepository.token';
import { FindAllHotelDTO } from '../domain/dto/findAllHotel.dto';

@Injectable()
export class FindAllHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,
  ) {}

  async execute({ page = 1, limit = 10 }: FindAllHotelDTO) {
    const offset = (page - 1) * limit;
    const { hotels, totalHotels } = await this.hotelRepository.findHotels(
      Number(offset),
      Number(limit),
    );

    // Parâmetros padrão para paginação.
    return { total: totalHotels, page, per_page: limit, data: hotels };
  }
}
