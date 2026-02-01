import { ReservationsStatus } from '@prisma/client';

// Criada esta interface para melhorar circulação de parãmetros entre service e repository.
export interface ICreateReservationsData {
  hotelId: number;
  checkIn: Date;
  checkOut: Date;
  status: ReservationsStatus;
  userId: number;
  total: number;
}
