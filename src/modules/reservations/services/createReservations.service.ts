import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { RESERVATIONS_REPOSITORY } from '../utils/reservationsRepository.token';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { parseISO, differenceInDays } from 'date-fns';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/Ihotel.repository';
import { HOTEL_REPOSITORY } from 'src/modules/hotels/utils/hotelRepository.token';
import { ReservationsStatus } from '@prisma/client';
import { ICreateReservationsData } from '../domain/repositories/Icreate-reservations.data';
import { MailerService } from '@nestjs-modules/mailer';
import { templateHTMLSendReservationPending } from '../utils/templateHTMLSendReservationPending';

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,

    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,

    private readonly mailerService: MailerService,
  ) {}

  // Precisa resolver valor negativo.
  async execute(userId: number, createReservationDto: CreateReservationDto) {
    const checkInDate = parseISO(createReservationDto.checkIn);
    const checkOutDate = parseISO(createReservationDto.checkOut);

    if (checkInDate >= checkOutDate)
      throw new BadRequestException(
        'Check-out date must be after check-in date.',
      );

    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    const hotel = await this.hotelRepository.findHotelById(
      createReservationDto.hotelId,
    );
    if (!hotel) throw new NotFoundException('Hotel not found.');

    const total = daysOfStay * hotel.price;
    const newReservation: ICreateReservationsData = {
      ...createReservationDto,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      // Precisa resolver valor negativo.
      total: total,
      userId: userId,
      status: ReservationsStatus.PENDING,
    };

    const reservation =
      await this.reservationsRepository.create(newReservation);

    // Aqui, usando o await, a resposta fica muito demorada pois o serviço de email é complexo, então posso tirar o await
    // que volta a ficar raṕido. Porém o eslint reclama da Promise sem await. Melhores soluções envolvem o uso de
    // serviços desacoplados, uma função externa ou algo assim para um retorno rápido para quem fizer a request
    // e o serviço de email roda paralelo.

    // Esta solução com void acalma o linter. O catch pode lidar com algum erro.
    void this.mailerService
      .sendMail({
        to: hotel.owner.email,
        subject: 'Pending Reservation Approval',
        html: templateHTMLSendReservationPending,
      })
      .catch((error) => {
        console.error('Error sending mail.', error);
      });

    return reservation;
  }
}
