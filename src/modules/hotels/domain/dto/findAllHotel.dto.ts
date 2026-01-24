import { IsNumber, IsOptional } from 'class-validator';

export class FindAllHotelDTO {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
