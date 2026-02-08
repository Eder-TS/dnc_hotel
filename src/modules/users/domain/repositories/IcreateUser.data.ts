import { Role } from '@prisma/client';

export interface ICreateUserData {
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
}
