import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address!: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  image?: string;

  @IsNotEmpty()
  @IsString()
  price!: string;

  @IsOptional()
  @IsNumber()
  ownerId?: number;
}
