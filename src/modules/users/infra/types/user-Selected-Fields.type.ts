import { Prisma } from '@prisma/client';
import { userSelectFields } from '../prisma/userSelectFields';

// Tipo especificado para retorno alinhado com o select.
// Aqui tenho acoplamento de domínio com infra.
export type UserSelectedFieldsType = Prisma.UserGetPayload<{
  select: typeof userSelectFields;
}>;
