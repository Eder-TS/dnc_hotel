import { ReservationsStatus } from '@prisma/client';
import { IUserSafeFieldsData } from 'src/modules/users/domain/repositories/IuserSafeFields.data';

export interface IReservationWithUserData {
  id: number;
  userId: number;
  user: IUserSafeFieldsData;
  hotelId: number;
  checkIn: Date;
  checkOut: Date;
  amount: number;
  status: ReservationsStatus;
  createdAt: Date;
  updatedAt: Date;
}
