import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { RESERVATIONS_REPOSITORY } from '../utils/hotelRepository.token';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { templateHTMLSendReservationUpdate } from '../utils/templateHTMLSendReservationUpdate';

@Injectable()
export class UpdateReservationsStatusService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: IReservationsRepository,

    private readonly mailerService: MailerService,
  ) {}

  async execute(updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationsRepository.findById(
      updateReservationDto.id,
    );
    if (!reservation) throw new NotFoundException('Reservation not found.');

    const updatedReservation =
      await this.reservationsRepository.updateStatus(updateReservationDto);

    await this.mailerService.sendMail({
      to: reservation.user.email,
      subject: 'Update Reservation Status',
      html: templateHTMLSendReservationUpdate(updatedReservation.status),
    });

    return updatedReservation;
  }
}
