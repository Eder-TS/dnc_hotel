import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { RESERVATIONS_REPOSITORY } from '../utils/hotelRepository.token';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { parseISO, differenceInDays } from 'date-fns';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/Ihotel.repository';
import { HOTEL_REPOSITORY } from 'src/modules/hotels/utils/hotelRepository.token';
import { ReservationsStatus } from '@prisma/client';
import { ICreateReservationsData } from '../domain/repositories/Icreate-reservations.data';

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,

    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,
  ) {}

  async execute(userId: number, createReservationDto: CreateReservationDto) {
    const checkInDate = parseISO(createReservationDto.checkIn);
    const checkOutDate = parseISO(createReservationDto.checkOut);

    if (checkInDate >= checkOutDate)
      throw new BadRequestException(
        'Check-out date must be after check-in date.',
      );

    const daysOfStay = differenceInDays(checkInDate, checkOutDate);

    const hotel = await this.hotelRepository.findHotelById(
      createReservationDto.hotelId,
    );
    if (!hotel) throw new NotFoundException('Hotel not found.');

    const total = daysOfStay * hotel.price;
    const newReservation: ICreateReservationsData = {
      ...createReservationDto,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      total: total,
      userId: userId,
      status: ReservationsStatus.PENDING,
    };

    return await this.reservationsRepository.create(newReservation);
  }
}
