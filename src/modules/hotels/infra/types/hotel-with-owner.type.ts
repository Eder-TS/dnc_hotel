import { Prisma } from '@prisma/client';
import { userSelectFields } from 'src/modules/users/infra/prisma/userSelectFields';

export type HotelWithOwnerType = Prisma.HotelGetPayload<{
  include: { owner: { select: typeof userSelectFields } };
}>;
