import { ReservationsStatus } from '@prisma/client';

export interface IUpdateReservationsData {
  id: number;
  status: ReservationsStatus;
}
