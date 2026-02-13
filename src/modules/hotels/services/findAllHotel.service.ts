import { Inject, Injectable } from '@nestjs/common';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import { FindAllHotelDTO } from '../domain/dto/findAllHotel.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';
import { AllHotelData } from '../domain/repositories/allHotel.data';

@Injectable()
export class FindAllHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,

    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  // Descobrir por quê execue está exigindo os parâmetros que são opcionais.
  async execute({ page = 1, limit = 10 }: FindAllHotelDTO) {
    const offset = (page - 1) * limit;

    // Está diferente da aula pois criei uma interface de dados para enviar para o repositório.
    let data: AllHotelData = { hotels: [], totalHotels: 0 };
    const hotelsRedis = await this.redis.get(REDIS_HOTEL_KEY);
    if (hotelsRedis) {
      data.hotels = JSON.parse(hotelsRedis);
      data.totalHotels = data.hotels.length;
    } else {
      data = await this.hotelRepository.findHotels(
        Number(offset),
        Number(limit),
      );
      await this.redis.set(REDIS_HOTEL_KEY, JSON.stringify(data.hotels));
    }

    // Parâmetros padrão para paginação.
    return {
      total: data.totalHotels,
      page,
      per_page: limit,
      data: data.hotels,
    };
  }
}
