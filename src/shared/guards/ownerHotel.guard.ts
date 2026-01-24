import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { FindHotelByIdService } from 'src/modules/hotels/services/findHotelById.service';

@Injectable()
export class OwnerHotelGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly hotelService: FindHotelByIdService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const hotelId = request.params.id;

    const user = request.user;
    if (!user) return false;

    const hotel = await this.hotelService.execute(+hotelId);
    if (!hotel) return false;

    return hotel.ownerId === user.id;
  }
}
