import { Prisma } from '@prisma/client';

export const hotelSelectFields = {
  id: true,
  name: true,
  description: true,
  address: true,
  image: true,
  price: true,
  ownerId: true,
  createdAt: true,
} satisfies Prisma.HotelSelect;
