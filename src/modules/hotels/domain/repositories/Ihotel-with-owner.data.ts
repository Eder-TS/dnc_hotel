import { IUserSafeFieldsData } from 'src/modules/users/domain/repositories/IuserSafeFields.data';

export interface IHotelWithOwnerData {
  id: number;
  name: string;
  description: string;
  address: string;
  image?: string | null;
  price: number;
  ownerId: number;
  owner: IUserSafeFieldsData;
  createdAt: Date;
  updatedAt: Date;
}
