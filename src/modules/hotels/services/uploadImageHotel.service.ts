import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY } from '../utils/hotelRepository.token';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { join, resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

@Injectable()
export class UploadImageHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,

    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async execute(id: number, imageFilename: string) {
    const hotel = await this.hotelRepository.findHotelById(id);
    if (!hotel)
      throw new HttpException('Hotel not found.', HttpStatus.NOT_FOUND);

    const directory = resolve(process.cwd(), 'uploads-hotel');
    if (hotel.image) {
      const hotelImageFilePath = join(directory, hotel.image);

      if (existsSync(hotelImageFilePath)) {
        unlinkSync(hotelImageFilePath);
      }
    }

    await this.redis.del(REDIS_HOTEL_KEY);

    return await this.hotelRepository.updateHotel(id, {
      image: imageFilename,
    });
  }
}
