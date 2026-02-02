import { Hotel } from '@prisma/client';
import { IUserSelectedFieldsData } from 'src/modules/users/domain/repositories/Iuser-Selected-Fields.data';

export interface IHotelAndOwnerData extends Hotel {
  owner: IUserSelectedFieldsData;
}
