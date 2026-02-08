import { User } from '@prisma/client';
import { IUserSafeFieldsData } from './IuserSafeFields.data';
import { IUpdateUserData } from './IupdateUser.data';
import { ICreateUserData } from './IcreateUser.data';

export interface IUserRepository {
  create(data: ICreateUserData): Promise<IUserSafeFieldsData>;
  list(): Promise<IUserSafeFieldsData[]>;
  findById(id: number): Promise<IUserSafeFieldsData | null>;
  findByEmail(email: string): Promise<User | null>;
  update(data: IUpdateUserData): Promise<IUserSafeFieldsData>;
  delete(id: number): Promise<User>;
}
