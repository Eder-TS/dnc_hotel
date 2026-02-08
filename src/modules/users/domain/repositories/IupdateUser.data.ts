import { Role } from '@prisma/client';

type HashedPassword = string;

export interface IUpdateUserData {
  id: number;
  name?: string;
  email?: string;
  password?: HashedPassword;
  role?: Role;
  avatar?: string;
}
