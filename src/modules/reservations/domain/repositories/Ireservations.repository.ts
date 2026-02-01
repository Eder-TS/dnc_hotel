import { Reservation } from '@prisma/client';
import { ICreateReservationsData } from './Icreate-reservations.data';
import { IUpdateReservationsData } from './Iupdate-reservations.data';

export interface IReservationsRepository {
  create(data: ICreateReservationsData): Promise<Reservation>;
  findById(id: number): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  //findByOwner(ownerId: number): Promise<Reservation[]>;
  findByUser(userId: number): Promise<Reservation[]>;
  updateStatus(data: IUpdateReservationsData): Promise<Reservation>;
}
