import { Role } from '@prisma/client';

// Aqui tenho algum acoplamento com infra, para um projeto grande e escalável é
// necessário melhorar isso.
export interface IUserSafeFieldsData {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  createdAt: Date;
}
