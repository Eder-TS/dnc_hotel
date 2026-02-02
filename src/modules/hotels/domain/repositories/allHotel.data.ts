import { Hotel } from '@prisma/client';

export class AllHotelData {
  hotels: Hotel[];
  totalHotels: number;
}
