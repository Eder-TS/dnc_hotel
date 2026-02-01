import { ReservationsStatus } from '@prisma/client';

export class UpdateReservationDto {
  id: number;
  status: ReservationsStatus;
}
