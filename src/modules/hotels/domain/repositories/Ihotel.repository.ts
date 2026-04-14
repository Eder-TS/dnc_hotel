import { Hotel } from '@prisma/client';
import { AllHotelData } from './allHotel.data';
import { IHotelWithOwnerData } from './Ihotel-with-owner.data';
import { ICreateHotelData } from './IcreateHotel.data';
import { IHotelData } from './Ihotel.data';
import { IUpdateHotelData } from './Iupdate-hotel.data';

export interface IHotelRepository {
  createHotel(data: ICreateHotelData): Promise<Hotel>;
  findHotelById(id: number): Promise<IHotelWithOwnerData | null>;
  findHotelByName(name: string): Promise<Hotel[] | null>;
  findHotelsByOwner(ownerId: number): Promise<IHotelData[]>;
  findHotels(offset: number, limit: number): Promise<AllHotelData>;
  updateHotel(id: number, data: IUpdateHotelData): Promise<Hotel>;
  deleteHotel(id: number): Promise<Hotel>;
}
