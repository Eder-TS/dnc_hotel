import { ReservationsStatus } from '@prisma/client';
import { IHotelData } from 'src/modules/hotels/domain/repositories/Ihotel.data';
import { IUserWithData } from 'src/modules/users/domain/repositories/IuserWith.data';

export interface IReservationWithHotelData {
  id: number;
  userId: number;
  hotelId: number;
  checkIn: Date;
  checkOut: Date;
  total: number;
  status: ReservationsStatus;
  createdAt: Date;
  updatedAt: Date;
  hotel: IHotelData;
  user?: IUserWithData;
}
