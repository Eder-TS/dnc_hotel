import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ICreateHotelData } from 'src/modules/hotels/domain/repositories/IcreateHotel.data';

export async function createHotel(
  prisma: PrismaService,
  data: Partial<ICreateHotelData> = {},
) {
  return prisma.hotel.create({
    data: {
      name: 'Hotel Teste',
      description: 'Descrição padrão',
      address: 'Endereço',
      price: 100,
      ownerId: data.ownerId!,
      ...data,
    },
  });
}
