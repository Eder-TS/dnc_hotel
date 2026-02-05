import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
// Usando type para resolver problema de injeção de interface, o quê não existe.
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

@Injectable()
export class CreateHotelService {
  // Não esquecer que, por boas práticas, a interface é que deve ser injetada e
  // não o repositório em si.
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,

    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async execute(ownerId: number, createHotelDto: CreateHotelDto) {
    await this.redis.del(REDIS_HOTEL_KEY);

    createHotelDto.ownerId = ownerId;
    return await this.hotelRepository.createHotel(createHotelDto);
  }
}
