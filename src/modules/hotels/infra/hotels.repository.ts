import { Hotel } from '@prisma/client';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { AllHotelData } from '../domain/repositories/allHotel.data';
import { userSelectFields } from 'src/modules/users/infra/prisma/userSelectFields';
import { IHotelWithOwnerData } from '../domain/repositories/Ihotel-with-owner.data';

@Injectable()
export class HotelsRepository implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHotel(data: CreateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.create({ data });
  }

  findHotelById(id: number): Promise<IHotelWithOwnerData | null> {
    return this.prisma.hotel.findUnique({
      where: { id },
      include: { owner: { select: userSelectFields } },
    });
  }

  findHotelByName(name: string): Promise<Hotel[] | null> {
    // findaMany pois podem ser retornados vários com nomes parecidos.
    return this.prisma.hotel.findMany({
      // Query para busca de valores semelhantes, pois quem busca pode não sabrer o nome correto.
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  findHotelByOwner(ownerId: number): Promise<Hotel | null> {
    return this.prisma.hotel.findFirst({
      where: { ownerId },
    });
  }

  async findHotels(offset: number, limit: number): Promise<AllHotelData> {
    // Sempre que usar findMany lembrar que é possível fazer a paginação com
    // take e skip. take é número de itens que serão retornados e skip é o número de itens
    // que serão deixados de fora a partir do primeiro, como se fosse um offset.
    const hotels = await this.prisma.hotel.findMany({
      take: limit,
      skip: offset,

      // Aqui é usado o relacionamento de tabela para trazer o owner todo, não apenas o ID.
      include: { owner: true },
    });

    const totalHotels = await this.prisma.hotel.count();

    return { hotels, totalHotels };
  }

  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({
      where: { id },
      data,
    });
  }

  deleteHotel(id: number): Promise<Hotel> {
    return this.prisma.hotel.delete({
      where: { id },
    });
  }
}
