import { Prisma } from '@prisma/client';

// Isto não pode ser usado como "contrato" do domínio pois é apenas detalhe específico da infra
// que estou usando. O correto é implementar interfaces que o repositório deverá seguir, na implementação
// do repositório é que deverá usar a infra para satisfazer a interface do repositório.
export const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  createdAt: true,
} satisfies Prisma.UserSelect;
