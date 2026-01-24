import { Hotel } from '@prisma/client';

export class AllHotelDTO {
  hotels: Hotel[];
  totalHotels: number;
}
