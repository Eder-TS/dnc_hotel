import { Hotel } from '@prisma/client';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { AllHotelData } from './allHotel.data';
import { IHotelWithOwnerData } from './Ihotel-with-owner.data';

export interface IHotelRepository {
  createHotel(data: CreateHotelDto): Promise<Hotel>;
  findHotelById(id: number): Promise<IHotelWithOwnerData | null>;
  findHotelByName(name: string): Promise<Hotel[] | null>;
  findHotelByOwner(ownerId: number): Promise<Hotel | null>;
  findHotels(offset: number, limit: number): Promise<AllHotelData>;
  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel>;
  deleteHotel(id: number): Promise<Hotel>;
}
