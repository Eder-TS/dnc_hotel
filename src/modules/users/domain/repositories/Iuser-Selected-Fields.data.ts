import { Role } from '@prisma/client';

export interface IUserSelectedFieldsData {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  createdAt: Date;
}
