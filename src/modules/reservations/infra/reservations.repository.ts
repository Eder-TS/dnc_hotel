import { Injectable } from '@nestjs/common';
import { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ICreateReservationsData } from '../domain/repositories/Icreate-reservations.data';
import { IUpdateReservationsData } from '../domain/repositories/Iupdate-reservations.data';

@Injectable()
export class ReservationsRepository implements IReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: ICreateReservationsData): Promise<Reservation> {
    return this.prisma.reservation.create({ data });
  }

  findById(id: number): Promise<Reservation | null> {
    return this.prisma.reservation.findUnique({ where: { id } });
  }

  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  findByUser(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({ where: { userId } });
  }

  updateStatus(data: IUpdateReservationsData): Promise<Reservation> {
    return this.prisma.reservation.update({
      where: { id: data.id },
      data: {
        status: data.status,
      },
    });
  }
}
