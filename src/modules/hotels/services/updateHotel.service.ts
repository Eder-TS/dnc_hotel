import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';
import { PriceToCents } from '../utils/priceToCents';
import { IUpdateHotelData } from '../domain/repositories/Iupdate-hotel.data';

@Injectable()
export class UpdateHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,

    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    await this.redis.del(REDIS_HOTEL_KEY);

    const data: IUpdateHotelData = {
      ...updateHotelDto,
      price: updateHotelDto.price
        ? PriceToCents(updateHotelDto.price)
        : undefined,
    };

    return await this.hotelRepository.updateHotel(id, data);
  }
}
