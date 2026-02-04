import { Reservation } from '@prisma/client';
import { ICreateReservationsData } from './Icreate-reservations.data';
import { IUpdateReservationsData } from './Iupdate-reservations.data';
import { IReservationWithUserData } from './Ireservation-with-user.data';

export interface IReservationsRepository {
  create(data: ICreateReservationsData): Promise<Reservation>;
  findById(id: number): Promise<IReservationWithUserData | null>;
  findAll(): Promise<Reservation[]>;
  findByUser(userId: number): Promise<Reservation[]>;
  updateStatus(data: IUpdateReservationsData): Promise<Reservation>;
}
