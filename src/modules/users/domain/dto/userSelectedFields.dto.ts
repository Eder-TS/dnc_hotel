import { Role } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UserSelectedFieldsDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsNotEmpty()
  avatar?: string | null;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
