import { IReservationWithHotelData } from 'src/modules/reservations/domain/repositories/Ireservation-with-hotel.data';
import { Role } from '@prisma/client';

export interface IUserWithLastReservationData {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role: Role;
  lastReservation: IReservationWithHotelData;
}
