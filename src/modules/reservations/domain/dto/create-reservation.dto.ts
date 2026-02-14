import { ReservationsStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  hotelId!: number;

  @IsString()
  @IsNotEmpty()
  checkIn!: string;

  @IsString()
  @IsNotEmpty()
  checkOut!: string;

  // Diferente do DTO de createUser, onde há o enum Role, aqui o eslint ficou reclamando
  // de não estar seguro quanto ao tipo de ReservationsStatus em @IsEnum(), então foi preciso fazer o cast
  // para object que é o quê o @IsEnum() espera.
  @IsEnum(ReservationsStatus as object)
  @IsOptional()
  @Transform(({ value }) => value ?? ReservationsStatus.PENDING)
  status?: ReservationsStatus;
}
