import { IReservationWithHotelData } from 'src/modules/reservations/domain/repositories/Ireservation-with-hotel.data';
import { Role } from '@prisma/client';
import { IHotelData } from 'src/modules/hotels/domain/repositories/Ihotel.data';

export interface IUserWithData {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role: Role;
  createdAt: Date;
  lastReservation?: IReservationWithHotelData;
  myHotels?: IHotelData[];
}
